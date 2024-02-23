(integration-testing-vms)=

# Integration testing with NixOS virtual machines

## What will you learn?

This tutorial introduces Nixpkgs functionality for testing NixOS configurations.
It also shows how to set up distributed test scenarios that involve multiple machines.

## What do you need?

- A working [Nix installation](<install-nix>) on Linux, or [NixOS](https://nixos.org/manual/nixos/stable/index.html#sec-installation)
- Basic knowledge of the [Nix language](<reading-nix-language>)
- Basic knowledge of [NixOS configuration](<nixos-vms>)

## Introduction

Nixpkgs provides a [test environment](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests) to automate integration testing for distributed systems.
It allows defining tests based on a set of declarative NixOS configurations and using a Python shell to interact with them through [QEMU](https://www.qemu.org/) as the backend.
Those tests are widely used to ensure that NixOS works as intended, so in general they are called [NixOS Tests](https://nixos.org/manual/nixos/stable/index.html#sec-nixos-tests).
They can be written and launched outside of NixOS, on any Linux machine[^darwin].

[^darwin]: Support for [running NixOS VM tests on macOS](https://github.com/NixOS/nixpkgs/issues/108984) is also implemented but [currently undocumented](https://github.com/NixOS/nixpkgs/issues/254552).

Integration tests are reproducible due to the design properties of Nix, making them a valuable part of a continuous integration (CI) pipeline.

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
  };
  testScript = { nodes, ... }: ''
    # ...
  '';
}
```

The function `nixosTest` takes a [module](https://nixos.org/manual/nixos/stable/#sec-writing-modules) to specify the [test options](https://nixos.org/manual/nixos/stable/index.html#sec-test-options-reference).
Because this module only sets configuration values, one can use the abbreviated module notation.

The following configuration values must be set:

- [`name`](https://nixos.org/manual/nixos/stable/index.html#test-opt-name) defines the name of the test.

- [`nodes`](https://nixos.org/manual/nixos/stable/index.html#test-opt-nodes) contains a set of named configurations, because a test script can involve more than one virtual machine.
  Each virtual machine is created from a NixOS configuration.

- [`testScript`](https://nixos.org/manual/nixos/stable/index.html#test-opt-testScript) defines the Python test script, either as literal string or as a function that takes a `nodes` attribute.
  This Python test script can access the virtual machines via the names used for the `nodes`.
  It has super user rights in the virtual machines.
  In the Python script each virtual machine is accessible via the `machine` object.
  NixOS provides [various methods](https://nixos.org/manual/nixos/stable/index.html#ssec-machine-objects) to run tests on these configurations.

The test framework automatically starts the virtual machines and runs the Python script.

## Minimal example

As a minimal test on the default configuration, we will check if the user `root` and `alice` can run Firefox.
We will build the example up from scratch.

1. Use a [pinned version of Nixpkgs](ref-pinning-nixpkgs), and [explicitly set configuration options and overlays](nixpkgs-config) to avoid them being inadvertently overridden by global configuration:

   ```nix
   let
     nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
     pkgs = import nixpkgs { config = {}; overlays = []; };
   in

   pkgs.nixosTest {
     # ...
   }
   ```

1. Label the test with a descriptive name:

   ```nix
   name = "minimal-test";
   ```

1. Because this example only uses one virtual machine, the node we specify is simply called `machine`.
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

1. This is the test script:

   ```python
   machine.wait_for_unit("default.target")
   machine.succeed("su -- alice -c 'which firefox'")
   machine.fail("su -- root -c 'which firefox'")
   ```

   This Python script refers to `machine` which is the name chosen for the virtual machine configuration used in the `nodes` attribute set.

   The script waits until systemd reaches `default.target`.
   It uses the `su` command to switch between users and the `which` command to check if the user has access to `firefox`.
   It expects that the command `which firefox` to succeed for user `alice` and to fail for `root`.

   This script will be the value of the `testScript` attribute.

The complete `minimal-test.nix` file content looks like the following:

```nix
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
</details>

## Tests with multiple virtual machines

Tests can involve multiple virtual machines, for example to test client-server-communication.

The following example setup includes:
- A virtual machine named `server` running [nginx](https://nginx.org/en/) with default configuration.
- A virtual machine named `client` that has `curl` available to make an HTTP request.
- A `testScript` orchestrating testing logic between `client` and `server`.

The complete `client-server-test.nix` file content looks like the following:

```{code-block}
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in

pkgs.nixosTest {
  name = "client-server-test";

  nodes.server = { pkgs, ... }: {
    networking = {
      firewall = {
        allowedTCPPorts = [ 80 ];
      };
    };
    services.nginx = {
      enable = true;
      virtualHosts."server" = {};
    };
  };

  nodes.client = { pkgs, ... }: {
    environment.systemPackages = with pkgs; [
      curl
    ];
  };

  testScript = ''
    server.wait_for_unit("default.target")
    client.wait_for_unit("default.target")
    client.succeed("curl http://server/ | grep -o \"Welcome to nginx!\"")
  '';
}
```

The test script performs the following steps:
1) Start the server and wait for it to be ready.
1) Start the client and wait for it to be ready.
1) Run `curl` on the client and use `grep` to check the expected return string.
   The test passes or fails based on the return value.

Run the test:

```shell-session
$ nix-build client-server-test.nix
```

## Additional information regarding NixOS tests

- Running integration tests on CI requires hardware acceleration, which many CIs do not support.

  To run integration tests in [GitHub Actions](<github-actions>) see [how to disable hardware acceleration](https://github.com/cachix/install-nix-action#how-do-i-run-nixos-tests).

- NixOS comes with a large set of tests that can serve as educational examples.

  A good inspiration is [Matrix bridging with an IRC](https://github.com/NixOS/nixpkgs/blob/master/nixos/tests/matrix/appservice-irc.nix).

<!-- TODO: move examples from https://nixos.wiki/wiki/NixOS_Testing_library to the NixOS manual and troubleshooting tips to nix.dev -->

## Next steps

- [](module-system-deep-dive)
- [](bootable-iso-image)
- [](nixos-docker-images)
