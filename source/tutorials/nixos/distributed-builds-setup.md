---
myst:
  html_meta:
    "description lang=en": "Setting up distributed builds"
    "keywords": "Nix, builds, distribution, scaling"
---

(distributed-build-setup-tutorial)=
# Setting up distributed builds

Nix can automatically distribute builds over multiple machines to accelerate builds with parallel execution.

## Introduction

In this tutorial you will set up a build machine and configure your local machine to utilize the build machine for distributed builds.

### What will you learn?

You'll learn how to
- Create a new user for remote build access from a local machine to the remote builder
- Configure remote builders with a sustainable setup
- Test remote builder connectivity and authentication
- Configure the local machine to automatically distribute builds

### What do you need?

- A *local machine* (Hostname `localmachine`): The central machine that distributes builds among remote builders.
- A *remote machine* (hostname `remotemachine`): One (of possibly many) machines that accept build jobs from the local machine.

Both machines should already be running NixOS.

### How long will it take?

- 25 minutes

## Create SSH key pair and prepare local machine

On the *local machine*, run the following command as `root` to create an SSH key pair:

```shell-session
ssh-keygen -f /root/.ssh/remotebuild
```

The local machine's Nix daemon runs as the `root` user and will need the *private* key file to authenticate itself to remote machines.
The remote builder configuration will need the *public* key to recognize the local machine.

:::{note}
The name and location of the key pair files can be freely chosen.
:::

## Set up remote builder

In the NixOS configuration folder of the *remote machine*, create the file `remote-builder.nix`:

```{code-block} nix
{
  users.users.remotebuild = {
    isNormalUser = true;
    createHome = false;
    group = "remotebuild";

    openssh.authorizedKeys.keyFiles = [ ./remotebuild.pub ];
  };

  users.groups.remotebuild = {};

  nix.settings.trusted-users = [ "remotebuild" ];
}
```

This configuration module creates a new user `remotebuild` with no home directory.
The `root` user will be able to log into the remote builder via SSH using the previously generated SSH key.

Copy the file `remotebuild.pub` into the same folder.

Add the new NixOS module to the existing machine configuration:

```{code-block} nix
{
  imports = [
    ./remote-builder.nix
  ];

  # ...
}
```

Activate the new configuration as root:

```shell-session
# nixos-rebuild switch
```

### Test authentication

Make sure that the SSH connection and authentication work.
On the *local machine*, run as `root`:

```shell-session
# ssh remotebuild@remotebuilder -i /root/.ssh/remotebuild "echo hello"
Could not chdir to home directory /home/remotebuild: No such file or directory
hello
```

If the hello" message is visible, the authentication works.
The `Could not chdir to ...` message can be ignored.

This test login also adds the host key of the remote builder to the `/root/.ssh/known_hosts` file of the local machine.
Future logins will not be interrupted by host key checks.

## Set up distributed builds

Obtain the correct `system` string for the remote machine by running this command on the remote machine:

```shell-session
$ nix-instantiate --eval -E builtins.currentSystem
"x86_64-linux"
```

### On GNU/Linux (other than NixOS) and macOS

Add the following lines to `/etc/nix/nix.conf`:

```
builders = ssh-ng://remotebuild@remotebuilder x86_64-linux /root/.ssh/remotebuilder 1 - - -
builders-use-substitutes = true
```

Replace `x86_64-linux` with your system string if it is different on the remote machine.


The first line registers the remote machine as a Nix builder.

The second line instructs the builder to reduce the number of Nix store paths transfered from the local machine by downloading as many paths as possible from Nix binary caches if available.
This assumes that the builder's internet connection is at least as fast as the local machine's internet connection.

To activate this configuration, restart the nix daemon.

On GNU/Linux, run as `root`:

```shell-session
# systemctl cat nix-daemon.service
```

On macOS, run as `root`:

```shell-session
# sudo launchctl stop org.nixos.nix-daemon
# sudo launchctl start org.nixos.nix-daemon
```

### On NixOS

In the NixOS configuration folder of the *local machine*, create the file `distributed-builds.nix`:

```{code-block} nix
{
  nix.buildMachines = [
    {
      hostName = "remotebuilder";
      sshUser = "remotebuild";
      sshKey = "/root/.ssh/remotebuild";
      system = "x86_64-linux";
      maxJobs = 1;
      speedFactor = 2;
      supportedFeatures = [ "nixos-test" "benchmark" "big-parallel" "kvm" ];
    }
  ];

  nix.distributedBuilds = true;
  nix.extraOptions = ''
    builders-use-substitutes = true
  '';
}
```

This configuration module enables distributed builds and adds the remote builder.
Replace `x86_64-linux` with your system string if it is different on the remote machine.

The `builders-use-substitute` line assumes that the builder's internet connection is at least as fast as the local machine's internet connection and will instruct it to download nix store paths from Nix binary caches by itself if available.
This reduces the number of store path transfers between local machine and remote machine.

Add the new NixOS module to the existing machine configuration:

```{code-block} nix
{
  imports = [
    ./distributed-builds.nix
  ];

  # ...
}
```

Activate the new configuration as root:

```shell-session
# nixos-rebuild switch
```


## Test distributed builds

Run this command on the *local machine*:

```shell-session
$ nix-build -E "(import <nixpkgs> {}).writeText \"test\" \"$(date)\"" -j0
this derivation will be built:
  /nix/store/9csjdxv6ir8ccnjl6ijs36izswjgchn0-test.drv
building '/nix/store/9csjdxv6ir8ccnjl6ijs36izswjgchn0-test.drv' on 'ssh://remotebuilder'...
Could not chdir to home directory /home/remotebuild: No such file or directory
copying 0 paths...
copying 1 paths...
copying path '/nix/store/hvj5vyg4723nly1qh5a8daifbi1yisb3-test' from 'ssh://remotebuilder'...
/nix/store/hvj5vyg4723nly1qh5a8daifbi1yisb3-test
```

This command builds a minimal uncacheable example derivation.
(The command line changes on every invocation because it depends on the always changing system time, which effectively makes it uncacheable.)
The `-j0` command line argument forces nix to build it on the remote builder.

The last line contains the output path and indicates that build distribution works as expected.

## Optimize remote builder configuration

To optimize memory and disk space, add the following lines to your `remote-builder.nix` configuration module:

```{code-block} diff
{
  users.users.remotebuild = {
    isNormalUser = true;
    createHome = false;
    group = "remotebuild";

    openssh.authorizedKeys.keyFiles = [ ./remotebuild.pub ];
  };

  users.groups.remotebuild = {};

-  nix.settings.trusted-users = [ "remotebuild" ];
+  nix = {
+    nrBuildUsers = 64;
+    settings = {
+      trusted-users = [ "remotebuild" ];
+
+      min-free = 10 * 1024 * 1024;
+      max-free = 200 * 1024 * 1024;

+      max-jobs = "auto";
+      cores = 0;
+    };
+  };

+  systemd.services.nix-daemon.serviceConfig = {
+    MemoryAccounting = true;
+    MemoryMax = "90%";
+    OOMScoreAdjust = 500;
+  };
}
```


## Next steps

To set up multiple builders, repeat the [Set up remote builder](#set-up-remote-builder) section for each remote builder.
Then, add all new remote builders to the `nix.buildMachines` attribute from the [Set up distributes builds](#set-up-distributed-builds) step.

Remote builders can have different performance characteristics.
For each `nix.buildMachines` item, set the `maxJobs`, `speedFactor`, and `supportedFeatures` attributes correctly for each different remote builder (refer to the [attribute reference](https://search.nixos.org/options?query=nix.buildMachines.).
This helps nix on the local machine distributing builds the optimal way.

You can also set the `nix.buildMachines.*.publicHostKey` field to each remote builder's public host key to secure build distribution against man-in-the-middle scenarios.

## Alternatives

- [nixbuild.net](https://nixbuild.net) - Nix remote builders as a Service
- [hercules CI](https://hercules-ci.com/) - CI with automatic build distribution

## References

- [`nix.conf` settings for distributed builds in the Nix manual](https://nix.dev/manual/nix/latest/command-ref/conf-file#conf-builders)
