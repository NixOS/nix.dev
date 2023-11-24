# Nix

## Forcing Nix to re-check if something exists in the binary cache?

Nix caches the contents of binary caches so that it doesn't have to query them
on every command. This includes negative answers (cache doesn't have something).
The default timeout for that is 1 hour as of writing.

To wipe all cache-lookup-caches:

```shell-session
$ rm $HOME/.cache/nix/binary-cache-v*.sqlite*
```

Alternatively, use the `narinfo-cache-negative-ttl` option to reduce the
cache timeout.
