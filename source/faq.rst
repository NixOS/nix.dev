Frequently Asked Questions
==========================

Nix
***

What to do if a binary cache is down or unreachable?
----------------------------------------------------

Pass ``--option substitute false`` to Nix commands.


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
    $ nix-build helpers/bench.nix --option extra-binary-caches https://hydra.snabb.co

How do I force nix to re-check whether something exists at a binary cache?
--------------------------------------------------------------------------

Nix caches the contents of binary caches so that it doesn't have to query them
on every command. This includes negative answers (cache doesn't have something).
The default timeout for that is 1 hour as of writing.

To wipe all cache-lookup-caches:

.. code-block:: bash

    $ rm $HOME/.cache/nix/binary-cache-v*.sqlite*

Alternatively, use the ``narinfo-cache-negative-ttl`` option to reduce the
cache timeout.


How do I fix: error: querying path in database: database disk image is malformed
--------------------------------------------------------------------------------

Try:

    sqlite3 /nix/var/nix/db/db.sqlite "pragma integrity_check"

Which will print the errors in the database. If the errors are due to missing
references, the following may work:

    mv /nix/var/nix/db/db.sqlite /nix/var/nix/db/db.sqlite-bkp
    sqlite3 /nix/var/nix/db/db.sqlite-bkp ".dump" | sqlite3 /nix/var/nix/db/db.sqlite

How to operate between Nix paths and strings?
---------------------------------------------


http://stackoverflow.com/a/43850372


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


How to build reverse dependencies of a package?
-----------------------------------------------

``nix-shell -p nixpkgs-review --run "nixpkgs-review wip"``

I'm getting: writing to file: Connection reset by peer
------------------------------------------------------

Too big files in src, out of resources (HDD space, memory)

What are channels and different branches on github?
---------------------------------------------------

See https://nixos.wiki/wiki/Nix_channels

How can I manage dotfiles in $HOME with Nix?
--------------------------------------------

https://github.com/rycee/home-manager

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

How do I connect to any of the machines in NixOS tests?
-------------------------------------------------------

Apply following patch:

::

    diff --git a/nixos/lib/test-driver/test-driver.pl b/nixos/lib/test-driver/test-driver.pl
    index 8ad0d67..838fbdd 100644
    --- a/nixos/lib/test-driver/test-driver.pl
    +++ b/nixos/lib/test-driver/test-driver.pl
    @@ -34,7 +34,7 @@ foreach my $vlan (split / /, $ENV{VLANS} || "") {
         if ($pid == 0) {
             dup2(fileno($pty->slave), 0);
             dup2(fileno($stdoutW), 1);
    -        exec "vde_switch -s $socket" or _exit(1);
    +        exec "vde_switch -tap tap0 -s $socket" or _exit(1);
         }
         close $stdoutW;
         print $pty "version\n";

And then the vde_switch network should be accessible locally.

How to bootstrap NixOS inside an existing Linux installation?
-------------------------------------------------------------

There are a couple of tools:

- https://github.com/jeaye/nixos-in-place
- https://github.com/elitak/nixos-infect
- https://github.com/cleverca22/nix-tests/tree/master/kexec
