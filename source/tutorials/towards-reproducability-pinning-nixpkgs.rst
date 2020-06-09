Towards reproducability: Pinning nixpkgs
========================================

In Nix snippets around the internet you'll often encounter the following:

.. code:: nix

    { pkgs ? import <nixpkgs> {}
    }:

    ...

To quickly demonstrate and get a working Nix expression by importing Nix packages.

But it doesn't make Nix expression reproducible. Two developers on different machines
are likely to get different result.

.. note::

  ``<nixpkgs>`` is syntax for looking up from shell environment variable ``$NIX_PATH``. 
  
  It is always set at the installation time to point to ``nixpkgs-unstable`` channel. 
  
  Channels are a way of distributing Nix software, but they are being phased out.
  So even though they are still used by default, it's recommended to avoid channels 
  and ``<nixpkgs>`` by always setting ``NIX_PATH=`` to be empty.


Pinning with URLs inside Nix expression
---------------------------------------

The simplest way to pin nixpkgs is to fetch them as a tarball specified via git commit:

.. code:: nix

    { pkgs ? import (fetchTarball https://github.com/NixOS/nixpkgs/archive/3590f02e7d5760e52072c1a729ee2250b5560746.tar.gz) {};
    }:

    ...

Picking the commit is easiest done via `status.nixos.org <https://status.nixos.org/>`_,
which lists all the releases and their latest commit that passed all the tests.

It's recommended to either follow latest stable NixOS release such as ``nixos-20.03``
or unstable via ``nixos-unstable``.


Dependency management with niv
------------------------------

If you'd like a bit more automation around bumping dependencies such as nixpkgs,
``niv`` is made for exactly that::

    $ niv init

This command will generate ``nix/sources.json`` with information how and where
dependencies are fetched and ``nix/sources.nix`` that glues them together in Nix.

By default ``niv`` will configure the latest stable NixOS release.

You can use it as:

.. code:: nix

    { sources ? import ./sources.nix 
    , pkgs ? import sources.nixpkgs {}
    }:   

    ...


.. Reference: nix.nixPath = [ ("nixpkgs=" + toString pkgs.path) ];
