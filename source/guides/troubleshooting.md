# Troubleshooting

## What to do if a binary cache is down or unreachable?

Pass [`--option substitute false`](https://nix.dev/manual/nix/2.18/command-ref/conf-file#conf-substitute) to Nix commands.

### How to fix: `error: querying path in database: database disk image is malformed`

This is a [known issue](https://github.com/NixOS/nix/issues/1353).
Try:

```shell-session
$ sqlite3 /nix/var/nix/db/db.sqlite "pragma integrity_check"
```

Which will print the errors in the [database](https://nix.dev/manual/nix/2.18/glossary#gloss-nix-database).
If the errors are due to missing references, the following may work:

```shell-session
$ mv /nix/var/nix/db/db.sqlite /nix/var/nix/db/db.sqlite-bkp
$ sqlite3 /nix/var/nix/db/db.sqlite-bkp ".dump" | sqlite3 /nix/var/nix/db/db.sqlite
```

### How to fix: `error: current Nix store schema is version 10, but I only support 7`

This is a [known issue](https://github.com/NixOS/nix/issues/1251).

It means that using a new version of Nix upgraded the SQLite schema of the [database](https://nix.dev/manual/nix/2.18/glossary#gloss-nix-database), and then you tried to use an older version Nix.

The solution is to dump the database, use the old Nix version to initialize it, and then re-import the data:

```shell-session
$ /path/to/nix/unstable/bin/nix-store --dump-db > /tmp/db.dump
$ mv /nix/var/nix/db /nix/var/nix/db.toonew
$ mkdir /nix/var/nix/db
$ nix-store --init # this is the old nix-store
$ nix-store --load-db < /tmp/db.dump
```

### How to fix: `writing to file: Connection reset by peer`

This may mean you are trying to import a too large file or directory into the [Nix store](https://nix.dev/manual/nix/2.18/glossary#gloss-store), or your machine is running out of resources, such as disk space or memory.

Try to reduce the size of the directory to import, or run [garbage collection](https://nix.dev/manual/nix/2.18/command-ref/nix-collect-garbage).
