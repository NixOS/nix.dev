Frequently Asked Questions
==========================

Nix
***

Secrets?
--------

How do I fix: error: querying path in database: database disk image is malformed
--------------------------------------------------------------------------------

Try:

    sqlite3 /nix/var/nix/db/db.sqlite "pragma integrity_check"

Which will print the errors in the database. If the errors are due to missing
references, the following may work:

    mv /nix/var/nix/db/db.sqlite /nix/var/nix/db/db.sqlite-bkp
    sqlite3 /nix/var/nix/db/db.sqlite-bkp ".dump" | sqlite3 /nix/var/nix/db/db.sqlite


How do I fix: error: current Nix store schema is version 10, but I only support 7
---------------------------------------------------------------------------------


This means you have upgraded Nix sqlite schema to a newer version, but then tried
to use older Nix.

The solution is to dump the db and use old Nix version to initialize it:

::

   /path/to/nix/unstable/bin/nix-store --dump-db > /tmp/db.dump
   mv /nix/var/nix/db /nix/var/nix/db.toonew
   mkdir /nix/var/nix/db
   nix-store --init (this is the old nix-store)
   nix-store --load-db < /tmp/db.dump

How nix decides which parts of the environment affect a derivation and its sha256 hash
--------------------------------------------------------------------------------------

How to build reverse dependencies of a package?
-----------------------------------------------

nox-review wip

I'm getting: writing to file: Connection reset by peer
------------------------------------------------------

Too big files in src, out of resources (HDD space, memory)

What are channels and different branches on github?
---------------------------------------------------

Subquestion: how stable is unstable?

How do I mirror tarballs?
-------------------------

We have a content-addressed tarball mirror at tarballs.nixos.org for this
purpose. "fetchurl" will automatically use this mirror to obtain files by hash.
However:

* The mirroring script was not running lately. I've revived it so 16.03 tarballs
  are mirrored now
  (https://github.com/NixOS/nixos-org-configurations/commit/a17ccf87deae4fb86639c8d34ab5938edd68d8c4).

* The mirroring script only copies tarballs of packages in the Nixpkgs Hydra
  jobset. Since moreutils is not part of the jobset, it's not mirrored. This can
  be fixed by adding a meta.platforms attribute to moreutils.

How can I manage dotfiles in $HOME with Nix?
--------------------------------------------

See following solutions:

- https://github.com/sheenobu/nix-home

Are there some known impurities in builds?
------------------------------------------

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones)
- current time/date
- FileSystem (ext4 has a known bug creating `empty files on power loss <https://github.com/NixOS/nixpkgs/issues/15581>`_)
- Kernel
- Timing behaviour of the build system (parallel Make not getting correct inputs in some cases)


What's the recommended process for building custom packages?
------------------------------------------------------------

 E.g. if I git clone nixpkgs how do I use the  cloned repo to define new / updated packages?              

NixOS
*****

How to build my own ISO?
------------------------

http://nixos.org/nixos/manual/index.html#sec-building-cd

How do I mix channels for packages?
-----------------------------------

Hydra
*****

What to do if Hydra is down or unreachable?
-------------------------------------------

It's best to set binary cache timeout:

.. code-block:: nix

  nix.extraOptions = ''
    connect-timeout = 10
  '';


How do I add a new binary cache?
--------------------------------

Using `NixOS`:

.. code-block:: nix

    trustedBinaryCaches = [ "https://cache.nixos.org" "https://hydra.snabb.co" ];
    binaryCaches = trustedBinaryCaches;
    binaryCachePublicKeys = [ "hydra.snabb.co-1:zPzKSJ1mynGtYEVbUR0QVZf9TLcaygz/OyzHlWo5AMM=" ];

Using `Nix`:

.. code-block:: bash

    $ echo "trusted-binary-caches = https://hydra.snabb.co" >> /etc/nix/nix.conf
    $ nix-build helpers/bench.nix --option extra-binary-caches https://hydra.snabb.co`






