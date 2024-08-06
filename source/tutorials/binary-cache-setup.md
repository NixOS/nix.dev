---
myst:
  html_meta:
    "description lang=en": "Setting Up a Binary Cache to Reuse Builds"
    "keywords": "Nix, caching"
---

(binary-cache-setup)=
# Set up a binary cache

A binary cache stores prebuilt Nix packages and provides them to other machines via network.
This way, users can accelerate builds and deployments by avoiding rebuilds.
Any machine with a nix store can be a binary cache for other machines.

The following configuration makes the following assumptions:

- The hostname is `cache.example.com` (replace it with yours)
- The host serves binaries via HTTP (port 80) and optionally via HTTPS (port 443)

## Generate key pair

A pair of private and public keys is important for serving binaries.
The private key is either used to sign binaries before they are served, or the binary cache signs the binaries while serving them.

Generate a key pair for the binary cache.
Replace the example hostname `cache.example.com` with your hostname.

```shell-session
mkdir /var/secrets
cd /var/secrets
nix-store --generate-binary-cache-key cache.example.com cache-private-key.pem cache-public-key.pem
```

`cache-private-key.pem` will be used by the binary cache daemon to sign the binaries as they are served.
It should only be accessible for the `nix-serve` daemon.
(We will set the access rights accordingly as soon as this user exists.)

The content of `cache-public-key.pem` needs to be distributed to everyone who shall access the binary cache.

:::{note}
The location `/var/secrets/` for keeping the key pair is not a requirement and can be chosen differently.
:::

## Set up services

Create a new NixOS configuration module in `/etc/nixos/binary-cache.nix`:

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
    virtualHosts = {
      "cache.example.com" = {
        locations."/".proxyPass = "http://${config.services.nix-serve.bindAddress}:${toString config.services.nix-serve.port}";
      };
    };
  };

  networking.firewall.allowedTCPPorts = [
    config.services.nginx.defaultHTTPListenPort
  ];
}
```

The attributes under `services.nix-serve.*` install and enable the binary cache service.
See also [the `services.nix-serve` options reference on search.nixos.org][nix-serve-options].

`nix-serve` does not serve via IPv6 and does not support SSL.
For this reason, this tutorial configures `services.nginx.*`.
Nginx listens on the HTTP port and forwards all connections to `nix-serve`.

From here, you can set up IPv6 ([IPv6 in the NixOS manual][nixos-ipv6]) if needed.
If your binary cache is publicly available, please refer to the [NixOS documentation on how to enable HTTPS][nginx-ssl] and adapt the port settings in `networking.firewall.allowedTCPPorts` accordingly.

Add the new NixOS module to your existing `/etc/nixos/configuration.nix`:

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

# Fix up secure access rights:
chmod -R 600 /var/secrets
chown -R nix-serve /var/secrets
```

## Test availability

The setup is complete.
The following steps check if everything is set up correctly and may help identifying problems.

### 1. Check general availability

Test if the binary cache, HTTP(s) reverse proxy, and firewall rules work correctly by running this command on a client machine:

```shell-session
$ curl https://cache.example.com/nix-cache-info
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

Other hosts can be configured to automatically push binaries to the binary cache using [the `post-build-hook` feature (Guide)](post-build-hook).

To save space, please refer to the following NixOS configuration attributes:

- [`nix.gc.*`][nix-gc]: Automatic periodic garbage collection Settings
- [`nix.optimise.*`][nix-optimise]: Automatic periodic nix store optimisation

## Alternatives

- [Cachix](https://www.cachix.org): Nix Binary Cache as a Service
- Amazon S3: Nix supports pushing to and pulling from S3 buckets (see [Nix manual about S3][nix-s3])
- Tigris: An alternative to S3
- Cloudflare R2: Another alternative to S3
- [attic](https://github.com/zhaofengli/attic): Alternative to `nix-serve` (open source)

## References

- [Nix Manual on HTTP Binary Cache Store](https://nix.dev/manual/nix/latest/store/types/http-binary-cache-store)
- [](custom-binary-cache) - Configure clients to use a binary cache
- [](post-build-hook) - Set up `post-build-hook` Guide
- [`services.nix-service` module definition](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/networking/nix-serve.nix)

[nix-serve-options]: https://search.nixos.org/options?query=services.nix-serve
[nginx-ssl]: https://nixos.org/manual/nixos/stable/#module-security-acme
[nixos-ipv6]: https://nixos.org/manual/nixos/stable/#sec-ipv6
[nix-gc]: https://search.nixos.org/options?query=nix.gc.
[nix-optimise]: https://search.nixos.org/options?query=nix.optimise.
[remote-build-machine]: https://nix.dev/manual/nix/latest/advanced-topics/distributed-builds
