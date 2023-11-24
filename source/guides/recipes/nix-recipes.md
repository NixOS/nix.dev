# Nix

## Forcing Nix to re-check if something exists in the binary cache

Nix stores the contents of binary caches so it doesn't have to query them on every command.
This includes negative answers (if cache is empty).
The default timeout for negative lookups is 1 hour at the time of writing.

To wipe all cache-lookup-caches:

```shell-session
$ rm $HOME/.cache/nix/binary-cache-v*.sqlite*
```

In that regard, pass the [`narinfo-cache-negative-ttl`](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-narinfo-cache-negative-ttl) option to the `nix.conf` file to reduce the cache timeout.
