(integration-testing-vms)=

# Integration testing using virtual machines

This tutorial aims to be compatible with NixOS release 22.11.

## What will you learn?

This tutorial introduces the functionality of Nixpkgs to write automated tests to debug NixOS configurations independent of a working NixOS installation.

## What do you need?

- A working installation of [Nix Package Manager](https://nixos.org/manual/nix/stable/installation/installation.html) or [NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-installation).
- Basic knowledge of the [Nix language](<nix-language>).
- Basic knowledge of [NixOS configuration](<nixos-vms>).

## Introduction

Nixpkgs provides a [test environment](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests) to automate integration testing for distributed systems.
It allows defining tests based on a set of declarative NixOS configurations and using a Python shell to interact with them through [QEMU](https://www.qemu.org/) as the backend.
Those tests are widely used to ensure that NixOS works as intended, so in general they are called [NixOS Tests](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests).
They can be written and launched outside of NixOS, on any Linux machine[^darwin].

[^darwin]: Support for running NixOS VM tests on macOS is also [implemented](https://github.com/NixOS/nixpkgs/issues/108984) but currently [undocumented](https://github.com/NixOS/nixpkgs/issues/254552).
Integration tests are reproducible due to the design properties of Nix, making them a valuable part of a Continuous Integration (CI) pipeline.

## The `nixosTest` function

NixOS VM tests are defined using the `nixosTest` function.
The pattern for NixOS VM tests looks like this:

```nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
  pkgs.nixosTest {
    name = "test-name";
    nodes = {
      machine1 = { config, pkgs, ... }: {
        # ...
      };
      machine2 = { config, pkgs, ... }: {
        # ...
      };
    }
    testScript = { nodes, ... }: ''
      # ...
    '';
  }
```

The function `nixosTest` takes an attribute set that follows the module convention to [specify the test](https://nixos.org/manual/nixos/stable/index.html#sec-test-options-reference).
Because the attribute set only defines options, one can use the abbreviated form of the [module convention](https://nixos.org/manual/nixos/stable/#sec-writing-modules).
The attribute set needs to define the following options:

- [`name`](https://nixos.org/manual/nixos/stable/index.html#test-opt-name) defines the name of the test.

- [`nodes`](https://nixos.org/manual/nixos/stable/index.html#test-opt-nodes) contains a set of named configurations, because a test script can involve more than one virtual machine.
  Each virtual machine is setup using a NixOS configuration.

- [`testScript`](https://nixos.org/manual/nixos/stable/index.html#test-opt-testScript) defines the Python test script, either as literal string or as a function that takes a `nodes` attribute.
  This Python test script can access the virtual machines via the names used for the `nodes`.
  It has super user rights in the virtual machines.
  In the Python script is each virtual machine is accessible via the `machine` object.
  NixOS provides [various methods](https://nixos.org/manual/nixos/stable/index.html#ssec-machine-objects) to run tests on these configurations.

The test framework automatically starts the virtual machines and runs the Python script.

## Minimal example

As a minimal test on the default configuration, we will check if the user `root` and `alice` can run Firefox.
We will build the example up from scratch.

As [recommended](<ref-pinning-nixpkgs>) we use an explicitly pinned version of Nixpkgs, and explicitly set configuration options and overlays to avoid them being inadvertently overridden by [global configuration](https://nixos.org/manual/nixpkgs/stable/#chap-packageconfig):

```nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
  pkgs.nixosTest {
    # ...
  }
```

### Options

#### Name

Label the test with a descriptive name such as "minimal-test":

```nix
name = "minimal-test";
```

#### Nodes

Because this example only uses one virtual machine, the node we specify is simply called `machine`.
This name is arbitrary and can be chosen freely.
As configuration you use the relevant parts of the default configuration, [that we used in a previous tutorial](<nixos-vms>):

```nix
nodes.machine = { config, pkgs, ... }: {
  users.users.alice = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    packages = with pkgs; [
      firefox
      tree
    ];
  };

  system.stateVersion = "22.11";
};
```

#### Test script

This is the test script:

```python
machine.wait_for_unit("default.target")
machine.succeed("su -- alice -c 'which firefox'")
machine.fail("su -- root -c 'which firefox'")
```

This Python script is referring to `machine` which is the name chosen for the virtual machine configuration used in the `nodes` attribute set.

The script waits until systemd reaches `default.target`.
It uses the `su` command to switch between users and the `which` command to check if the user has access to `firefox`.
It expects that the command `which firefox` to succeed for user `alice` and to fail for `root`.

This script will be the value of the `testScript` attribute.

### Test file

The complete `minimal-test.nix` file content looks like the following:

```{code-block}
let
    nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
  pkgs.nixosTest {
    name = "minimal-test";
    nodes.machine = { config, pkgs, ... }: {

      users.users.alice = {
        isNormalUser = true;
        extraGroups = [ "wheel" ];
        packages = with pkgs; [
          firefox
          tree
        ];
      };

      system.stateVersion = "22.11";
    };
    testScript = ''
      machine.wait_for_unit("default.target")
      machine.succeed("su -- alice -c 'which firefox'")
      machine.fail("su -- root -c 'which firefox'")
    '';
  }
```

## Running tests

To set up all machines and run the test script:

```shell-session
$ nix-build minimal-test.nix
```

    ...
    test script finished in 10.96s
    cleaning up
    killing machine (pid 10)
    (0.00 seconds)
    /nix/store/bx7z3imvxxpwkkza10vb23czhw7873w2-vm-test-run-minimal-test


## Interactive Python shell in the virtual machine

When developing tests or when something breaks, it’s useful to interactively tinker with the test or access a terminal for a machine.

To start an interactive Python session with the testing framework:

```shell-session
$ $(nix-build -A driverInteractive minimal-test.nix)/bin/nixos-test-driver
```

Here you can run any of the testing operations.
Execute the `testScript` attribute from `minimal-test.nix` with the `test_script()` function.

If a virtual machine is not yet started, the test environment takes care of it on the first call of a method on a `machine` object.

But you can also manually trigger the start of the virtual machine with:

```shell-session
>>> machine.start()
```
for a specific node,

or

```shell-session
>>> start_all()
```
for all nodes.

You can enter a interactive shell on the virtual machine using:

```shell-session
>>> machine.shell_interact()
```

and run shell commands like:

```shell-session
uname -a
```

    Linux server 5.10.37 #1-NixOS SMP Fri May 14 07:50:46 UTC 2021 x86_64 GNU/Linux


<details><summary>Re-running successful tests</summary>

<!-- FIXME: this should be a separate recipe that can be linked to, as it's a bit of knowledge one will need now and again. -->

Because test results are kept in the Nix store, a successful test is cached.
This means that Nix will not run the test a second time as long as the test setup (node configuration and test script) stays semantically the same.
Therefore, to run a test again, one needs to remove the result.

If you would try to delete the result using the symbolic link, you will get the following error:

```shell-session
nix-store --delete ./result
```

    finding garbage collector roots...
    0 store paths deleted, 0.00 MiB freed
    error: Cannot delete path '/nix/store/4klj06bsilkqkn6h2sia8dcsi72wbcfl-vm-test-run-unnamed' since it is still alive. To find out why, use: nix-store --query --roots

Instead, remove the symbolic link and only then remove the cached result:

```shell-session
rm ./result
nix-store --delete /nix/store/4klj06bsilkqkn6h2sia8dcsi72wbcfl-vm-test-run-unnamed
```

This can be also done with one command:

```shell-session
result=$(readlink -f ./result) rm ./result && nix-store --delete $result
```
<details>

## Tests that need multiple virtual machines

Tests can involve multiple virtual machines.

This example uses the use-case of a [REST](https://en.m.wikipedia.org/wiki/REST) interface to a [PostgreSQL](https://www.postgresql.org/) database.
The following example Nix expression is adapted from [How to use NixOS for lightweight integration tests](https://www.haskellforall.com/2020/11/how-to-use-nixos-for-lightweight.html).

This tutorial follows [PostgREST tutorial](https://postgrest.org/en/stable/tutorials/tut0.html), a generic [RESTful API](https://restfulapi.net/) for PostgreSQL.

If you skim over the official tutorial, you'll notice there's quite a bit of setup in order to test if all the steps work.

The setup includes:

- A virtual machine named `server` running PostgreSQL and PostgREST.
- A virtual machine named `client` running HTTP client queries using `curl`.
- A `testScript` orchestrating testing logic between `client` and `server`.

The complete `postgrest.nix` file looks like the following:

```{code-block}
let
  # Pin Nixpkgs, as some packages are broken in the 22.11 release
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/0f8f64b54ed07966b83db2f20c888d5e035012ef.tar.gz";
  pkgs = import nixpkgs { config = {}; overlays = []; };

  # Single source of truth for all tutorial constants
  database = "postgres";
  schema        = "api";
  table         = "todos";
  username      = "authenticator";
  password      = "mysecretpassword";
  webRole       = "web_anon";
  postgrestPort = 3000;

  # NixOS module shared between server and client
  sharedModule = {
    # Since it's common for CI not to have $DISPLAY available, explicitly disable graphics support
    virtualisation.graphics = false;
  };

in 
  pkgs.nixosTest {
    # NixOS tests are run inside a virtual machine, and here you specify its system type
    system = "x86_64-linux";
    name = "postgres-test";
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

            # Create a system user that matches the database user so that you
            # can use peer authentication. The tutorial defines a password,
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
}
```

Unlike the previous example, the virtual machines need an expressive name to distinguish them.
For this example we choose `client` and `server`.

Set up all machines and run the test script:

```shell-session
nix-build postgrest.nix
```

    ...
    test script finished in 10.96s
    cleaning up
    killing client (pid 10)
    killing server (pid 22)
    (0.00 seconds)
    /nix/store/bx7z3imvxxpwkkza10vb23czhw7873w2-vm-test-run-unnamed


```

## Additional information regarding NixOS tests:
  - Running integration tests on CI requires hardware acceleration, which many CIs do not support.


    To run integration tests on [GitHub Actions](<github-actions>) see [how to disable hardware acceleration](https://github.com/cachix/install-nix-action#how-do-i-run-nixos-tests).
  - NixOS comes with a large set of tests that serve also as educational examples.


    A good inspiration is [Matrix bridging with an IRC](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/matrix/appservice-irc.nix).

<!-- TODO: move examples from https://nixos.wiki/wiki/NixOS_Testing_library to the NixOS manual and troubleshooting tips to nix.dev -->
