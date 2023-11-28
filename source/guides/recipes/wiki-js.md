(setup-wiki-js)=
# Setup wiki.js

[Wiki.js](https://js.wiki/) is a modern, open-source wiki engine running on Node.js and written in JavaScript. It offers a sleek and user-friendly platform for managing and sharing knowledge.

To quickly set up an instance of Wiki.js on your local NixOS machine, a database service is required, and optionnaly a reverse proxy for HTTPS URLs.

Below is a streamlined and ready-to-use recipe to spawn this service on your server:

```nix
{ pkgs
, config
, ...
}:

{
  services.postgresql = {
    enable = true;
    ensureDatabases = [ "wikijs" ];
    authentication = pkgs.lib.mkOverride 10 ''
      #type database  DBuser  auth-method
      local all       all     trust
    '';
    ensureUsers = [
      {
        name = "wikijs";
        ensureDBOwnership = true;
      }
    ];
  };

  services.wiki-js = {
    enable = true;
    settings = {
      bindIp = "127.0.0.1";
      port = 3000;

      db = {
        db   = "wikijs";
        user = "wikijs";
        host = "/run/postgresql";
      };
    };
  };

  # Replace `wiki.router.lan` with your own domain name
  services.caddy.virtualHosts."wiki.router.lan".extraConfig = ''
    tls internal
    reverse_proxy http://127.0.0.1:3000
  '';
}
```
