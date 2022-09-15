(integration-testing-vms)=

# Integration testing using virtual machines (VMs)

## What will you learn?

This guide introduces the functionality of Nix Package Manager to write automated tests to debug NixOS configurations independent of a working NixOS installation.

## What do you need?

- Basic knowledge of the Nix language.<!-- todo link after merge -->
- A working installation of [Nix Package Manager](https://nixos.org/manual/nix/stable/installation/installation.html) or [NixOS](https://nixos.org/manual/nixos/stable/#sec-installation).
- [Nixpkgs path set in `$NIX_PATH`](https://nix.dev/tutorials/towards-reproducibility-pinning-nixpkgs#)
- NixOS configuration in vm tutorial<!-- todo link after merge -->

## Introduction

NixOS provides a [test environment](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests) to automate integration testing.
The function `nixosTest` takes an attribute set that specifies the test.

```nix
let
  nixpkgs = <nixpkgs>;
  pkgs = import nixpkgs {};
in
  pkgs.nixosTest {
    nodes = {
      machine1 = { config, pkgs, ... }: {
        # ...
      };
      machine2 = { config, pkgs, ... }: {
        # ...
      };
    }
    testScript = {nodes, ...}: ''
      # ...
    '';
  }
```

The attribute set has two attributes `nodes` and `testScript`.
The attribute `nodes` contains a set of named configurations, because a test script can involve more than one virtual machine.
Each virtual machine is setup using a NixOS configuration.
The attribute `testScript` contains a function that returns the Python test script.

This Python test script can access the virtual machines via the names used for the `nodes`.
It has super user rights in the virtual machines.
In the Python script is each virtual machine is accessible via the `machine` object.
NixOS provides [various methods](https://nixos.org/manual/nixos/stable/index.html#ssec-machine-objects) to run tests on these configurations.

The test framework automatically starts the virtual machines and runs the Python script.

## Minimal example

As a minimal test on the default configuration<!-- todo link to nixos-configuration tutorial when it is merged -->, we will check if the user `root` and `alice` can run Firefox.

### Nodes

Because this example only uses one virtual machine the node you specify is simply called `machine`.

```nix
let
  nixpkgs = <nixpkgs>;
  pkgs = import nixpkgs {};
in
  pkgs.nixosTest {
    nodes.machine = { config, pkgs, ... }: {
      # ...
    }
  }
```

### Test script

This is the test script:

```python
machine.wait_for_unit("default.target")
machine.succeed("su -- alice -c 'which firefox'")
machine.fail("su -- root -c 'which firefox'")
```

The Python script is referring to `machine` which is the name chosen for the virtual machine configuration, that is listed in the nodes attribute set.

The script waits until start up is reaching systemd `default.target`.
It utilizes the `su` command to switch between users and the `which` command to see if the user has access to `firefox`.
It expects that the command `which firefox` to succeed for user `alice` and to fail for `root`.

This script needs to be located in a function inside the `testScript` attribute.

The complete `minimaltest.nix` file content looks like the following:

```{code-block}
let
  nixpkgs = <nixpkgs>;
  pkgs = import nixpkgs {};
in
  pkgs.nixosTest {
    nodes.machine = { config, pkgs, ... }: {
      boot.loader.systemd-boot.enable = true;
      boot.loader.efi.canTouchEfiVariables = true;

      services.xserver.enable = true;
      services.xserver.displayManager.gdm.enable = true;
      services.xserver.desktopManager.gnome.enable = true;

      users.users.alice = {
        isNormalUser = true;
        extraGroups = [ "wheel" ];
        packages = with pkgs; [
          firefox
          thunderbird
        ];
      };

      system.stateVersion = "22.05";
    };
    testScript = {nodes, ...}: ''
      machine.wait_for_unit("default.target")
      machine.succeed("su -- alice -c 'which firefox'")
      machine.fail("su -- root -c 'which firefox'")
    '';
  }
```

## Running tests

To set up all machines and execute the test script:

```shell-session
$ nix-build minimaltest.nix
```


    ...
    test script finished in 10.96s
    cleaning up
    killing machine (pid 10)
    (0.00 seconds)
    /nix/store/bx7z3imvxxpwkkza10vb23czhw7873w2-vm-test-run-unnamed

## Interactive Python shell to interact with virtual machine

When developing tests or when something breaks, it’s useful to interactively tinker with the test or access a terminal for a machine.

To interactively start a Python session with the testing framework:

```shell-session
$ $(nix-build -A driverInteractive minimaltest.nix)/bin/nixos-test-driver
```

You can run any of the testing operations.
The `testScript` attribute from `minimaltest.nix` definition can be executed with `test_script()` function.

Within this Python shell you can enter a interactive shell and run Python commands like those in the test script.

If a virtual machine is not yet started, the test environment takes care of it on the first call of a method of a `machine` object.

But you can also manually trigger the start of the virtual machine by using

```shell-session
>>> machine.start()
```
for a specific node,

or

```shell-session
>>> start_all()
```
for all specified nodes.

You can enter a interactive shell on the virtual machine using:

```shell-session
>>> machine.shell_interact()
```

and run commandline commands like:

```shell-session
uname -a
```

    Linux server 5.10.37 #1-NixOS SMP Fri May 14 07:50:46 UTC 2021 x86_64 GNU/Linux


## Re-run successful tests

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

### wayland application example (todo remove home-manager)

The configuration we are using is starting the gnome desktop manager using wayland.
To test if a wayland application is working is more complicated because we need to automate the login into gnome and automated startup of the application. Additionally we need to enable access to gnome dbus interface. To do this we need to modify the configuration

 the automated start of the application including automated login to gnome/wayland

In the machine configuration we need to enable autologin for the user alice.

```nix
      services.xserver.displayManager.autoLogin.enable = true;
      services.xserver.displayManager.autoLogin.user = "alice";
```

To simplify our test script we pin the uid of the user to 1000.
```nix
        uid = 1000;
```

We specify a service that automatically starts Firefox after login, which is easier than doing this in the test script.

```nix
      environment.systemPackages = [
        (pkgs.makeAutostartItem {
          name = "firefox";
          package = pkgs.firefox;
        })
      ];
```
<!-- check again if this is best practice -->

Since GNOME doesn't allow the evaluation of JavaScript to get information about open windows, we need to override the GNOME Shell startup service to start `gnome-shell` in unsafe mode:

```nix
      systemd.user.services = {
        "org.gnome.Shell@wayland" = {
          serviceConfig = {
            ExecStart = [
              # Clear the list before overriding it. This is a quirk of systemd.
              ""
              # Eval API is now internal so Shell needs to run in unsafe mode.
              "${pkgs.gnome.gnome-shell}/bin/gnome-shell --unsafe-mode"
            ];
          };
        };
```

The test script utilizes the GNOME DBus interface to get a list of open Wayland windows.
We wait until Firefox appears to be started and make a screenshot that will be found in the result folder.

```{code-block}
    testScript = {nodes, ...}: let
      user = nodes.machine.config.users.users.alice;
      bus = "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${toString user.uid}/bus";
      gdbus = "${bus} gdbus";
      su = command: "su - ${user.name} -c '${command}'";
      gseval = "call --session -d org.gnome.Shell -o /org/gnome/Shell -m org.gnome.Shell.Eval";
      wmClass = su "${gdbus} ${gseval} global.display.focus_window.wm_class";
    in ''
      machine.wait_until_succeeds("${wmClass} | grep -q 'firefox'")
      machine.sleep(20)
      machine.screenshot("screen")
    '';
```

The complete `firefoxtest.nix` file looks like the following:
```{code-block}
let
  nixpkgs = builtins.fetchTarball "https://github.com/nixOS/nixpkgs/archive/22.05.tar.gz";
  pkgs = import nixpkgs {};
  home-manager = builtins.fetchTarball "https://github.com/nix-community/home-manager/archive/release-22.05.tar.gz";
in
  pkgs.nixosTest {
    nodes.machine = {...}: {
      imports = [
        (import "${home-manager}/nixos")
      ];
      boot.loader.systemd-boot.enable = true;
      boot.loader.efi.canTouchEfiVariables = true;

      services.xserver.enable = true;
      services.xserver.displayManager.gdm.enable = true;
      services.xserver.desktopManager.gnome.enable = true;
      services.xserver.displayManager.autoLogin.enable = true;
      services.xserver.displayManager.autoLogin.user = "alice";

      users.users.alice = {
        isNormalUser = true;
        extraGroups = ["wheel"]; # Enable ‘sudo’ for the user.
        uid = 1000;
      };

      home-manager.users.alice = {
        home.packages = [
          pkgs.firefox
          pkgs.thunderbird
        ];
      };

      system.stateVersion = "22.05";

      environment.systemPackages = [
        (pkgs.makeAutostartItem {
          name = "firefox";
          package = pkgs.firefox;
        })
      ];

      systemd.user.services = {
        "org.gnome.Shell@wayland" = {
          serviceConfig = {
            ExecStart = [
              # Clear the list before overriding it.
              ""
              # Eval API is now internal so Shell needs to run in unsafe mode.
              "${pkgs.gnome.gnome-shell}/bin/gnome-shell --unsafe-mode"
            ];
          };
        };
      };
    };

    testScript = {nodes, ...}: let
      user = nodes.machine.config.users.users.alice;
      #uid = toString user.uid;
      bus = "DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/${toString user.uid}/bus";
      gdbus = "${bus} gdbus";
      su = command: "su - ${user.name} -c '${command}'";
      gseval = "call --session -d org.gnome.Shell -o /org/gnome/Shell -m org.gnome.Shell.Eval";
      wmClass = su "${gdbus} ${gseval} global.display.focus_window.wm_class";
    in ''
      machine.wait_until_succeeds("${wmClass} | grep -q 'firefox'")
      machine.sleep(20)
      machine.screenshot("screen")
    '';
  }
```

## Tests that need multiple virtual machines

Tests can utilize multiple virtual machines.

This example uses the use-case of a REST interface to a Postgres database.

This tutorial follows [PostgREST tutorial](https://postgrest.org/en/stable/tutorials/tut0.html), a generic [RESTful API](https://restfulapi.net/) for PostgreSQL.

If you skim over the official tutorial, you'll notice there's quite a bit of setup in order to test if all the steps work.

The setup includes:

- A virtual machine named `server` running postgreSQL and postgREST.
- A virtual machine named `client` running HTTP client queries using `curl`.
- A `testScript` orchestrating testing logic between `client` and `server`.

Because some of the needed packages of this example are broken in 22.05 release this example uses a specific revision of nixpkgs.
Additionally this example shows the value of pinning a test to a specific revision of `nixpkgs`.<!-- link to pinning -->

The complete `postgrest.nix` file looks like the following:
```{code-block}
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
    # Since it's common for CI not to have $DISPLAY available, you have to explicitly tell the tests "please don't expect any screen available"
    virtualisation.graphics = false;
  };

in pkgs.nixosTest ({
  # NixOS tests are run inside a virtual machine, and here you specify system of the machine.
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
})
```

Unlike the previous example, the virtual machines need an expressive name to distinguish them.
For this example we choose `client` and `server`.

To set up all machines and execute the test script:

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


to run the test run:
```shell-session
$ nix-build postgrest.nix
```

## Additional information regarding tests:
  - NixOS Tests section in [NixOS manual](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests)
  - Running integration tests on CI requires hardware acceleration, which many CIs do not support.
    To run integration tests on {ref}`GitHub Actions <github-actions>` see [how to disable hardware acceleration](https://github.com/cachix/install-nix-action#how-can-i-run-nixos-tests).
  - NixOS comes with a large set of tests that serve also as educational examples. 
    A good inspiration is [Matrix bridging with an IRC](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/matrix/appservice-irc.nix).
  - [NixOS.wiki on  NixOS Testing library](https://nixos.wiki/wiki/NixOS_Testing_library) seems to be mostly outdated (last edit 05.11.2021)
