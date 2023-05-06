# Nix store

## How do I fix: error: querying path in database: database disk image is malformed

Try:

```shell-session
$ sqlite3 /nix/var/nix/db/db.sqlite "pragma integrity_check"
```

Which will print the errors in the database. If the errors are due to missing
references, the following may work:

```shell-session
$ mv /nix/var/nix/db/db.sqlite /nix/var/nix/db/db.sqlite-bkp
$ sqlite3 /nix/var/nix/db/db.sqlite-bkp ".dump" | sqlite3 /nix/var/nix/db/db.sqlite
```

## How are strings expanded to Nix store paths?

See <http://stackoverflow.com/a/43850372>

## How do I fix: error: current Nix store schema is version 10, but I only support 7

This means you have upgraded Nix sqlite schema to a newer version, but then tried
to use older Nix.

The solution is to dump the db and use old Nix version to initialize it:

```shell-session
$ /path/to/nix/unstable/bin/nix-store --dump-db > /tmp/db.dump
$ mv /nix/var/nix/db /nix/var/nix/db.toonew
$ mkdir /nix/var/nix/db
$ nix-store --init # this is the old nix-store
$ nix-store --load-db < /tmp/db.dump
```