---
myst:
  html_meta:
    "description lang=en": "Set up distributed builds"
    "keywords": "Nix, builds, distribution, scaling"
---

(distributed-build-setup)=
# Set up distributed builds

Nix can distribute builds over multiple remote builders to accelerate builds with parallel execution.
Nix automatically determines the order and parallelity in which packages may be built.
Build distribution happens automatically and transparent to users of nix commands if set up correctly.

To set up build distribution between two machines, assume the following two roles in this tutorial:

- The *local machine* (Hostname `localmachine`): The central machine that distributes builds among remote builders.
- The *remote builder* (hostname `remotebuilder`): One (of possibly many) machines that accept build jobs from the local machine.

The local machine can be configured to distribute among many remote builders.

## Create SSH key pair and prepare local machine

On the *local machine*, run the following command as root to create an SSH key pair:

```shell-session
ssh-keygen -f /root/.ssh/remotebuild
```

The local machine will use the private key file to authenticate itself to remote builders.
The remote builder configuration will have the public key to recognize the local machine.

:::{note}
The name and location of the key pair files can be freely chosen.
:::

## Set up remote builder

On the *remote builder*, create the file `/etc/nixos/remote-builder.nix`:

```{code-block} nix
{
  users.users.remotebuild = {
    isNormalUser = true;
    createHome = false;
    group = "remotebuild";

    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJBGJd/w3Qa6fX75U2qo1Vttl9QyWycAQ1ijaUu+MsnZ root@localmachine"
    ];
  };

  users.groups.remotebuild = {};

  nix.settings.trusted-users = [ "remotebuild" ];
}
```

Replace the string in `openssh.authorizedKeys.keys` with the content of the file `/root/.ssh/remotebuild.pub` from the local machine.

This configuration module creates a new user `remotebuild` with no home directory.
The `root` user will be able to log into the remote builder via SSH because the configuration module installs the earlier generated key in this user account.

Add this NixOS configuration module to your existing `/etc/nixos/configuration.nix` import list:

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

On the *local machine*, run this as root:

```shell-session
# ssh remotebuild@remotebuilder -i /root/.ssh/remotebuild "echo hello"
Could not chdir to home directory /home/remotebuild: No such file or directory
hello
```

This command ensures that the SSH connection and authentication work.
The `Could not chdir to ...` message can be ignored.

It also adds the host key of the remote builder to the `/root/.ssh/known_hosts` file of the local machine.
Future logins will not be interrupted by host key checks.

## Set up distributed builds

On the *local machine*, add the file `/etc/nixos/distributed-builds.nix`:

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
Replace `system` with the correct architecture if yours differs.

Add this NixOS configuration module to `/etc/nixos/configuration.nix`:

```{code-block} nix
{
  imports = [
    ./distributed-builds.nix
  ];

  # ...
}
```

Run as root:

```shell-session
# nixos-rebuild switch
```

### Test distributed builds

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
The `-j0` command line argument forces nix to build it on the remote builder.

The last line contains the output path and indicates that build distribution works as expected.

## Outlook

To set up multiple builders, repeat the "Set Up Remote Builder" step for each remote builder.
Add the new remote builders to the `nix.buildMachines` list on the local machine.

Remote builders can have different performance characteristics.
For each `nix.buildMachines` item, set the `maxJobs`, `speedFactor`, and `supportedFeatures` attributes correctly for each different remote builder (refer to the [attribute reference][build-machines-reference]).
This helps nix on the local machine distributing builds the best way.

You can also set the `nix.buildMachines.*.publicHostKey` field with each remote builder's public host key to increase security.

## Alternatives

- [nixbuild.net](https://nixbuild.net) - Nix remote builders as a Service
- [hercules CI](https://hercules-ci.com/) - CI with automatic build distribution

## References

- [`nix.buildMachines` reference][build-machines-reference]
- [Settings for Distributed Builds in the Nix Manual][distributed-builds-nix]

[nix-serve-options]: https://search.nixos.org/options?query=services.nix-serve
[distributed-builds-nix]: https://nix.dev/manual/nix/2.18/advanced-topics/distributed-builds
[build-machines-reference]: https://search.nixos.org/options?query=nix.buildMachines.
