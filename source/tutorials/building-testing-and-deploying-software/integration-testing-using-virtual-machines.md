(integration-testing-vms)=

# Integration testing using virtual machines (VMs)

One of the most powerful features in the Nix ecosystem is **the ability
to provide a set of declarative NixOS configurations and use a simple
Python interface** to interact with them using [QEMU](https://www.qemu.org/)
as the backend.

Those tests are widely used to ensure that NixOS works as intended, so in general they are called **NixOS tests**.
They can be written and launched outside of NixOS, on any Linux machine (with
[MacOS support coming soon](https://github.com/NixOS/nixpkgs/issues/108984)).

Integration tests are reproducible due to the design properties of Nix,
making them a valuable part of a Continuous Integration (CI) pipeline.

## Testing a typical web application backed by PostgreSQL

This tutorial follows [PostgREST tutorial](https://postgrest.org/en/stable/tutorials/tut0.html),
a generic [RESTful API](https://restfulapi.net/) for PostgreSQL.

If you skim over the official tutorial, you'll notice there's quite a bit of setup
in order to test if all the steps work.

We are going to set up:

- A VM named `server` running postgreSQL and postgREST.
- A VM named `client` running HTTP client queries using `curl`.
- A `testScript` orchestrating testing logic between `client` and `server`.

The following example Nix expression is adapted from [How to use NixOS for lightweight integration tests](https://www.haskellforall.com/2020/11/how-to-use-nixos-for-lightweight.html).

## Writing the test

Create `postgrest.nix`:

% TODO: highlight nix https://github.com/pygments/pygments/issues/1793

```{code-block}
:linenos: true

let
  # Pin nixpkgs, see pinning tutorial for more details
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/0f8f64b54ed07966b83db2f20c888d5e035012ef.tar.gz";
  pkgs = import nixpkgs {};

  # Single source of truth for all tutorial constants
  database      = "postgres";
  schema        = "api";
  table         = "todos";
  username      = "authenticator";
  password      = "mysecretpassword";
  webRole       = "web_anon";
  postgrestPort = 3000;

  # NixOS module shared between server and client
  sharedModule = {
    # Since it's common for CI not to have $DISPLAY available, we have to explicitly tell the tests "please don't expect any screen available"
    virtualisation.graphics = false;
  };

in pkgs.nixosTest ({
  # NixOS tests are run inside a virtual machine, and here we specify system of the machine.
  system = "x86_64-linux";

  nodes = {
    server = { config, pkgs, ... }: {
      imports = [ sharedModule ];

      networking.firewall.allowedTCPPorts = [ postgrestPort ];

      services.postgresql = {
        enable = true;

        initialScript = pkgs.writeText "initialScript.sql" ''
          create schema ${schema};

          create table ${schema}.${table} (
              id serial primary key,
              done boolean not null default false,
              task text not null,
              due timestamptz
          );

          insert into ${schema}.${table} (task) values ('finish tutorial 0'), ('pat self on back');

          create role ${webRole} nologin;
          grant usage on schema ${schema} to ${webRole};
          grant select on ${schema}.${table} to ${webRole};

          create role ${username} inherit login password '${password}';
          grant ${webRole} to ${username};
        '';
      };

      users = {
        mutableUsers = false;
        users = {
          # For ease of debugging the VM as the `root` user
          root.password = "";

          # Create a system user that matches the database user so that we
          # can use peer authentication.  The tutorial defines a password,
          # but it's not necessary.
          "${username}".isSystemUser = true;
        };
      };

      systemd.services.postgrest = {
        wantedBy = [ "multi-user.target" ];
        after = [ "postgresql.service" ];
        script =
          let
            configuration = pkgs.writeText "tutorial.conf" ''
                db-uri = "postgres://${username}:${password}@localhost:${toString config.services.postgresql.port}/${database}"
                db-schema = "${schema}"
                db-anon-role = "${username}"
            '';
          in "${pkgs.haskellPackages.postgrest}/bin/postgrest ${configuration}";
        serviceConfig.User = username;
      };
    };

    client = {
      imports = [ sharedModule ];
    };
  };

  # Disable linting for simpler debugging of the testScript
  skipLint = true;

  testScript = ''
    import json
    import sys

    start_all()

    server.wait_for_open_port(${toString postgrestPort})

    expected = [
        {"id": 1, "done": False, "task": "finish tutorial 0", "due": None},
        {"id": 2, "done": False, "task": "pat self on back", "due": None},
    ]

    actual = json.loads(
        client.succeed(
            "${pkgs.curl}/bin/curl http://server:${toString postgrestPort}/${table}"
        )
    )

    assert expected == actual, "table query returns expected content"
  '';
})
```

A few notes:

- Between the machines defined inside the `nodes` attribute, hostnames
  are resolved based on their attribute names. In this case we have `client` and `server`.
- The testing framework exposes a wide set of operations used inside the `testScript`.
  A full set of testing operations is part of
  [VM testing operations API Reference](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests).

## Running tests

To set up all machines and execute the test script:

```shell-session
$ nix-build postgrest.nix
```

You'll notice an error message if something goes wrong.

In case the tests succeed, you should see at the end:

```shell-session
...
test script finished in 10.96s
cleaning up
killing client (pid 10)
killing server (pid 22)
(0.00 seconds)
/nix/store/bx7z3imvxxpwkkza10vb23czhw7873w2-vm-test-run-unnamed
```

## Developing and debugging tests

When developing tests or when something breaks, it's useful to interactively fiddle
with the script or access a terminal for a machine.

To interactively start a Python session with a testing framework:

```shell-session
$ $(nix-build -A driverInteractive postgrest.nix)/bin/nixos-test-driver
...
starting VDE switch for network 1
>>>
```

You can run [any of the testing operations](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests).
The `testScript` attribute from our `postgrest.nix` definition can be executed with `test_script()` function.

To start all machines and enter a telnet terminal to a specific machine:

```shell-session
>>> start_all()
...
>>> server.shell_interact()
server: Terminal is ready (there is no prompt):

uname -a
Linux server 5.10.37 #1-NixOS SMP Fri May 14 07:50:46 UTC 2021 x86_64 GNU/Linux
```

## Next steps

- Running integration tests on CI requires hardware acceleration, which many CIs do not support.
  To run integration tests on {ref}`GitHub Actions <github-actions>` see
  [how to disable hardware acceleration](https://github.com/cachix/install-nix-action#how-do-i-run-nixos-tests).
- NixOS comes with a large set of tests that serve also as educational examples. A good inspiration is [Matrix bridging with an IRC](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/matrix/appservice-irc.nix).
