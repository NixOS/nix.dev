---
myst:
  html_meta:
    "description lang=en": "Setting up distributed builds"
    "keywords": "Nix, builds, distribution, scaling"
---

(distributed-build-setup-tutorial)=
# Setting up distributed builds

Nix can speed up builds by spreading the work across multiple computers at once.

## Introduction

In this tutorial, you'll set up a separate build machine and configure your local machine to offload builds to it.

### What will you learn?

You'll learn how to
- Create a new user for remote build access from a local machine to the remote builder
- Configure remote builders with a sustainable setup
- Test remote builder connectivity and authentication
- Configure the local machine to automatically distribute builds

### What do you need?

- Familiarity with the [Nix language](reading-nix-language)
- Familiarity with the [](module-system-tutorial)

- A *local machine* (example hostname: `localmachine`)

  The computer [with Nix installed](install-nix) that distributes builds to other machines.

- A *remote machine* (example hostname: `remotemachine`)

  A computer running NixOS that accepts build jobs from the *local machine*.
  Follow [](provisioning-remote-machines-tutorial) to set up a remote NixOS system.

### How long will it take?

- 25 minutes

## Create an SSH key pair

The *local machine*'s Nix daemon runs as the `root` user and will need the *private* key file to authenticate itself to remote machines.
The *remote machine* will need the *public* key to recognize the *local machine*.

On the *local machine*, run the following command as `root` to create an SSH key pair:

```shell-session
# ssh-keygen -f /root/.ssh/remotebuild
```

:::{note}
The name and location of the key pair files can be freely chosen.
:::

(set-up-remote-builder)=
## Set up the remote builder

In the NixOS configuration directory of the *remote machine*, create the file `remote-builder.nix`:

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

Copy the file `remotebuild.pub` into this directory.

This configuration module creates a new user `remotebuild` with no home directory.
The `root` user on the *local machine* will be able to log into the remote builder via SSH using the previously generated SSH key.

Add the new NixOS module to the existing configuration of the *remote machine*:

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
nixos-rebuild switch --no-flake --target-host root@remotemachine
```

### Test authentication

Make sure that the SSH connection and authentication work.
On the *local machine*, run as `root`:

```shell-session
# ssh remotebuild@remotemachine -i /root/.ssh/remotebuild "echo hello"
Could not chdir to home directory /home/remotebuild: No such file or directory
hello
```

If the `hello` message is visible, the authentication works.
The `Could not chdir to ...` message confirms that the remote user has no home directory.

This test login also adds the host key of the remote builder to the `/root/.ssh/known_hosts` file of the local machine.
Future logins will not be interrupted by host key checks.

(set-up-distributed-builds)=
## Set up distributed builds

:::{note}
If your *local machine* runs NixOS, skip this section and [configure Nix through module options](distributed-builds-config-nixos).
:::

Configure Nix to use the remote builder by adding to the [Nix configuration file](https://nix.dev/manual/nix/2.23/command-ref/conf-file) as `root`:

```
# cat << EOF >> /etc/nix/nix.conf
builders = ssh-ng://remotebuild@remotebuilder $(nix-instantiate --eval -E builtins.currentSystem) /root/.ssh/remotemachine - - nixos-test,big-parallel,kvm
builders-use-substitutes = true
```

::::{dropdown} Detailed explanation
The first line registers the remote machine as a remote builder by specifying
- The protocol, user, and hostname
- The *local machine*'s [system type](https://nix.dev/manual/nix/2.24/command-ref/conf-file#conf-system)

  This will delegate jobs for that system type to the *remote machine*.

- The location of the SSH key
- A list of [supported system features](https://nix.dev/manual/nix/2.23/command-ref/conf-file#conf-system-features)

  This particular list must be specified in order to delegate building compilers and running [NixOS VM tests](integration-testing-vms) to remote machines.

See the [reference documentation on the  `builders` setting](https://nix.dev/manual/nix/2.24/command-ref/conf-file#conf-builders) for details.

The second line instructs all remote builders to obtain dependencies from its own binary caches instead of from the *local machine*.
This assumes that the remote builders' internet connection is at least as fast as the local machine's internet connection.
::::

To activate this configuration, restart the Nix daemon:

:::::{tab-set}
::::{tab-item} Linux
On Linux with `systemd`, run as `root`:

```shell-session
# systemctl cat nix-daemon.service
```
::::

::::{tab-item} macOS
On macOS, run as `root`:

```shell-session
# sudo launchctl stop org.nixos.nix-daemon
# sudo launchctl start org.nixos.nix-daemon
```
::::
:::::


(distributed-builds-config-nixos)=
:::::{admonition} NixOS

If your *local machine* runs NixOS, in its configuration directory create the file `distributed-builds.nix`:

```{code-block} nix
{ pkgs, ... }:
{
  nix.distributedBuilds = true;
  nix.settings.builders-use-substitutes = true;

  nix.buildMachines = [
    {
      hostName = "remotebuilder";
      sshUser = "remotebuild";
      sshKey = "/root/.ssh/remotebuild";
      system = pkgs.stdenv.hostPlatform;
      supportedFeatures = [ "nixos-test" "big-parallel" "kvm" ];
    }
  ];
}
```

::::{dropdown} Detailed explanation
This configuration module enables distributed builds and adds the remote builder, specifying:
- The SSH hostname and username
- The location of the SSH key
- Which  *local machine*'s [system type](https://nix.dev/manual/nix/2.24/command-ref/conf-file#conf-system)

  This will delegate jobs for that system type to the *remote machine*.

- A list of [supported system features](https://nix.dev/manual/nix/2.23/command-ref/conf-file#conf-system-features)

  This particular list must be specified in order to delegate building compilers and running [NixOS VM tests](integration-testing-vms) to remote machines.

See the [NixOS option documentation on `nix.buildMachines`](https://search.nixos.org/options?query=nix.buildMachines) for details.

The `builders-use-substitutes` instructs all remote builders to obtain dependencies from its own binary caches instead of from the *local machine*.
This assumes that the remote builders' internet connection is at least as fast as the local machine's internet connection.
::::

Add the new NixOS module to the existing machine configuration:

```{code-block} nix
{
  imports = [
    ./distributed-builds.nix
  ];

  # ...
}
```

Activate the new configuration as `root`:

```shell-session
# nixos-rebuild switch
```
:::::

## Test distributed builds

Try building an new derivation on the *local machine*:

```shell-session
$ nix-build --max-jobs 0 -E << EOF
(import <nixpkgs> {}).writeText "test" "$(date)"
EOF
this derivation will be built:
  /nix/store/9csjdxv6ir8ccnjl6ijs36izswjgchn0-test.drv
building '/nix/store/9csjdxv6ir8ccnjl6ijs36izswjgchn0-test.drv' on 'ssh://remotebuilder'...
Could not chdir to home directory /home/remotebuild: No such file or directory
copying 0 paths...
copying 1 paths...
copying path '/nix/store/hvj5vyg4723nly1qh5a8daifbi1yisb3-test' from 'ssh://remotebuilder'...
/nix/store/hvj5vyg4723nly1qh5a8daifbi1yisb3-test
```

The derivation to build changes on every invocation because it depends on the current system time, and thus can never be in the local cache.
The [`--max-jobs 0` command line argument](https://nix.dev/manual/nix/2.23/command-ref/conf-file#conf-max-jobs) forces Nix to build it on the remote builder.

The last output line contains the output path and indicates that build distribution works as expected.

## Optimise the remote builder configuration

To maximise parallelism, enable automatic garbage collection, and prevent Nix builds from consuming all memory, add the following lines to your `remote-builder.nix` configuration module:

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

:::{tip}
Refer to the [Nix reference manual](https://nix.dev/manual/nix/2.24/command-ref/conf-file) for details on the options available in [`nix.settings`](https://search.nixos.org/options?show=nix.settings).
:::

Remote builders can have different performance characteristics.
For each `nix.buildMachines` item, set the `maxJobs`, `speedFactor`, and `supportedFeatures` attributes correctly for each different remote builder.
This helps Nix on the *local machine* distributing builds the optimal way.

:::{tip}
Refer to the [NixOS option documentation on `nix.buildMachines`](https://search.nixos.org/options?query=nix.buildMachines) for details.
:::

Set the `nix.buildMachines.*.publicHostKey` field to each remote builder's public host key to secure build distribution against man-in-the-middle scenarios.

## Next steps

- [](custom-binary-cache) on each remote builder
- [](post-build-hooks) to upload store objects to a binary cache

To set up multiple builders, repeat the instructions in the [](set-up-remote-builder) section for each remote builder.
Add all new remote builders to the `nix.buildMachines` attribute shown in the [](set-up-distributed-builds) section.

## Alternatives

- [nixbuild.net](https://nixbuild.net) - Nix remote builders as a service
- [Hercules CI](https://hercules-ci.com/) - Continuous integration with automatic build distribution

## References

- [Nix reference manual: Settings for distributed builds](https://nix.dev/manual/nix/latest/command-ref/conf-file#conf-builders)
