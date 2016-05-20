Frequently Asked Questions
==========================

Nix
***

How do I fix: error: querying path in database: database disk image is malformed
--------------------------------------------------------------------------------

No known solution yet.


How nix decides which parts of the environment affect a derivation and its sha256 hash
--------------------------------------------------------------------------------------


What are channels and different branches on github?
---------------------------------------------------


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

Are there some known impurities in builds?
------------------------------------------

Yes.

- CPU (we try hard to avoid compiling native instructions, but rather hardcode supported ones)
- current time/date
- FileSystem (ext4 has a known bug creating `empty files on power loss <https://github.com/NixOS/nixpkgs/issues/15581>`_)
- Kernel
- Timing behaviour of the build system (parallel Make not getting correct inputs in some cases)

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






