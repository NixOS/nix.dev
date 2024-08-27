---
myst:
  html_meta:
    "description lang=en": "Setting up a binary cache to reuse builds"
    "keywords": "Nix, caching"
---

# Setting up a binary cache

A binary cache stores prebuilt [Nix store objects](https://nix.dev/manual/nix/latest/store/store-object) and provides them to other machines over the network.
This way, one machine can download prebuilt packages from another instead of rebuilding them.
Any machine with a Nix store can be a binary cache for other machines.

## Introduction

In this tutorial you will set up a Nix binary cache that will serve store objects from a NixOS machine over HTTP or HTTPS.

### What will you learn?

You'll learn how to
- Set up signing keys for your cache
- Enable the right services on the NixOS machine serving the cache
- Check that the setup works as intended

### Prerequisites

- A machine that runs NixOS

  If you're new to NixOS, learn about the [](module-system-deep-dive) and [](nixos-vms) to configure your first system.

- (optional) A public IP and DNS domain

  If you don't host yourself, check [NixOS friendly hosters](https://wiki.nixos.org/wiki/NixOS_friendly_hosters) on the NixOS Wiki.
  Follow the tutorial on [](provisioning-remote-machines) to deploy your NixOS configuration.

For a cache on a local network, we assume:
- The hostname is `cache` (replace it with yours, or an IP address)
- The host serves store objects via HTTP on port 80 (this is the default)

For a publicly accessible cache, we assume:
- The domain name is `cache.example.com` (replace it with yours)
- The host serves store objects via HTTPS on port 443 (this is the default)

### How long will it take?

~10 minutes

## Set up services

Create a new NixOS configuration module file `binary-cache.nix` in the same folder where your `configuration.nix` is:

```{code-block} nix
{ config, ... }:

{
  services.nix-serve = {
    enable = true;
    secretKeyFile = "/var/secrets/cache-private-key.pem";
  };

  services.nginx = {
    enable = true;
    recommendedProxySettings = true;
    virtualHosts."cache.example.com" = {
      locations."/".proxyPass = "http://${config.services.nix-serve.bindAddress}:${toString config.services.nix-serve.port}";
    };
  };

  networking.firewall.allowedTCPPorts = [
    config.services.nginx.defaultHTTPListenPort
  ];
}
```

The attributes under `services.nix-serve.*` install and enable the binary cache service.
See also [the `services.nix-serve` options reference on search.nixos.org][nix-serve-options].

`nix-serve` does not serve via IPv6 and does not support SSL/HTTPS.
For this reason, this tutorial configures `services.nginx.*`.
Nginx listens on the HTTP port and forwards all connections to `nix-serve`.
There is an optional HTTPS section in the end of this tutorial.

Add the new NixOS module to your existing `configuration.nix`:

```{code-block} nix
{ config, ... }:

{
  imports = [
    ./binary-cache.nix
  ];

  # ...
}
```

Activate the new configuration as root:

```shell-session
nixos-rebuild switch
```

The binary cache daemon will report errors because there is no secret key file, yet.

## Generate key pair

A pair of private and public keys is important to ensure that the store objects in the cache can be trusted.
The private key is either used to sign store objects right after are built, or the binary cache signs the store objects while serving them.

To generate a key pair for the binary cache, replace the example hostname `cache.example.com` with your hostname:

```shell-session
mkdir /var/secrets
cd /var/secrets
nix-store --generate-binary-cache-key cache.example.com cache-private-key.pem cache-public-key.pem
```

`cache-private-key.pem` will be used by the binary cache daemon to sign the binaries as they are served.

Up until now, the binary cache daemon was in a restart loop due to the missing secret key file.
It should now work correctly, which can be checked with the command `systemctl status nix-serve.service`.

Distribute `cache-public-key.pem` to all machines that should be able to access the binary cache.

:::{note}
The location `/var/secrets/` for keeping the key pair is not a requirement and can be chosen differently.
:::

## Test availability

The setup is complete.
The following steps check if everything is set up correctly and may help identifying problems.

### 1. Check general availability

Test if the binary cache, HTTP(s) reverse proxy, and firewall rules work correctly by running this command on a client machine:

```shell-session
$ curl http://cache.example.com/nix-cache-info
StoreDir: /nix/store
WantMassQuery: 1
Priority: 30
```

### 2. Check binary signing

Test if binaries are signed correctly with the following two steps.

On the binary cache host, run this command:

```shell-session
$ curl "http://cache.example.com/$(nix-build '<nixpkgs>' -A pkgs.hello | awk -F '/' '{print $4}' | awk -F '-' '{print $1}').narinfo" | grep "Sig: "
...
Sig: build01.nix-consulting.de:GyBFzocLAeLEFd0hr2noK84VzPUw0ArCNYEnrm1YXakdsC5FkO2Bkj2JH8Xjou+wxeXMjFKa0YP2AML7nBWsAg==
```

It is important that the output contains this line prefixed with `Sig:` with the previously generated public key.

:::{note}
This one-liner builds a package and extracts its hash to calculate a valid URL in the cache.
(From `/nix/store/<hash>-<name>-<version>`, it derives `http://cache.example.com/<hash>.narinfo`.)
Querying this URL exposes information about the cached nix store path.
:::

## Outlook

You can now distribute the hostname and public key to anyone who wants access to your new binary cache.
Configure clients with [this guide about binary cache client configuration](custom-binary-cache).

If your binary cache is already a [remote build machine][remote-build-machine], it will serve all binaries in its nix store.

Other hosts can be configured to automatically push binaries to the binary cache using [the `post-build-hook` feature (Guide)](post-build-hooks).

## Next steps

- [](custom-binary-cache)
- [](post-build-hooks)

To save space, please refer to the following NixOS configuration attributes:

- [`nix.gc.*`][nix-gc]: Automatic periodic garbage collection Settings
- [`nix.optimise.*`][nix-optimise]: Automatic periodic nix store optimisation

### Serving via HTTPS from a public address

If the binary cache is publicly accessible, it is possible to enforce HTTPS with [Let's encrypt](https://letsencrypt.org/) SSL certificates.
Edit your `binary-cache.nix` like this and make sure to replace the example URL and mail address with yours:

```{code-block} nix
{ config, ... }:
{
  # ...

  services.nginx = {
    # ...
    virtualHosts."cache.example.com" = {
      enableACME = true;
      forceSSL = true;
      # ...
    };
  };

  networking.firewall.allowedTCPPorts = [
    config.services.nginx.defaultHTTPListenPort
    config.services.nginx.defaultSSLListenPort
  ];

  security.acme = {
    acceptTerms = true;
    certs = {
      "cache.example.com".email = "you@example.com";
    };
  };
}
```

Rebuild the system to activate these changes.


## Alternatives

- [Cachix](https://www.cachix.org): Nix Binary Cache as a Service
- Amazon S3: Nix supports pushing to and pulling from S3 buckets (see [Nix manual about S3][nix-s3])
- Tigris: An alternative to S3
- Cloudflare R2: Another alternative to S3
- [attic](https://github.com/zhaofengli/attic): Alternative to `nix-serve` (open source)

## References

- [Nix Manual on HTTP Binary Cache Store](https://nix.dev/manual/nix/latest/store/types/http-binary-cache-store)
- [`services.nix-serve` module definition](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/networking/nix-serve.nix)

[nix-serve-options]: https://search.nixos.org/options?query=services.nix-serve
[nginx-ssl]: https://nixos.org/manual/nixos/stable/#module-security-acme
[nixos-ipv6]: https://nixos.org/manual/nixos/stable/#sec-ipv6
[nix-gc]: https://search.nixos.org/options?query=nix.gc.
[nix-optimise]: https://search.nixos.org/options?query=nix.optimise.
[remote-build-machine]: https://nix.dev/manual/nix/latest/advanced-topics/distributed-builds
