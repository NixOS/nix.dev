Nix language
============


Unquoted URLs
-------------

Nix syntax supports URLs as verbatim, so one can write ``https://example.com`` instead of ``"https://example.com"``

There's was an `RFC 45 <https://github.com/NixOS/rfcs/pull/45>`_ accepted to deprecate verbatim URLS and provides
a number of arguments how this feature does more harm than good.


``rec { ... }`` expression
--------------------------

``rec`` allows you to reference variables within an attribute set.

A simple example:

.. code:: nix

  rec {
    a = 1;
    b = a + 2;
  }

evaluating to ``{ a = 1; b = 3; }``.

``b`` refers to ``a`` as ``rec`` makes all keys available within the attribute set.

There are a couple of pitfalls:

- It's possible to introduce a hard to debug error ``infinite recursion`` when shadowing a variable,
  the simplest example being ``rec { b = b; }``.

- combining with overriding logic such as ``overrideAttrs`` function in nixpkgs has a surprising behaviour
  of not overriding every reference.

A better way is to use simpler ``let .. in``:

.. code:: nix

  let
    a = 1;
  in {
    a = a;
    b = a + 2;
  }


``with attrset; ...`` expression
--------------------------------

It's common to see the following expression in the wild:

.. code:: nix

    with (import <nixpkgs> {});

    ...

Which brings all packages into scope of the current expression so that ``pkgs.git`` becomes ``git``.

There are a number of problems with such approach:

- Static analysis can't reason about the code, because it would have to actually evaluate this file to see what
  variables are in scope.

- As soon as there are two ``with`` used, it's not clear anymore from which the variables are coming from.

- Scoping rules around ``with`` are not intuitive, see `Nix issue for details <https://github.com/NixOS/nix/issues/490>`_

A better way is to use a variable:

.. code:: nix

    let
      pkgs = import <nixpkgs> {};
    in ...


``<...>`` search path
---------------------

``<...>`` is syntax, commonly ``<nixpkgs>`` is for looking up Nix expression's path
specified by shell environment variable ``$NIX_PATH``.

Two developers on different machines are likely to have `<nixpkgs>` point to different revisions,
which will lead to getting different results.

It's :ref:`possible to specify exact nixpkgs commit <ref-pinning-nixpkgs>` via ``$NIX_PATH``,
but that's still problematic unless:

a) You specify the commit **at one place only** and reference it else where.

b) And you can control the environment via your source code,
   so that a) applies by somehow setting ``$NIX_PATH`` via nix-shell or NixOS options

See :ref:`pinning-nixpkgs` for a tutorial on how to do better.


``attr1 // attr2`` merge operator
----------------------------------

It merges two attribute sets:

.. code:: shell-session

  $ nix repl
  Welcome to Nix version 2.3.6. Type :? for help.

  nix-repl> { a = 1; b = 2; } // { b = 3; c = 4; }
  { a = 1; b = 3; c = 4; }

However, if attribute sets are nested it doesn't merge them::

  nix-repl> :p { a = { b = 1; }; } // { a = { c = 3; }; }
  { a = { c = 3; }; }

You can see key ``b`` was removed, because whole ``a`` value was replaced.

A better way is to use ``pkgs.lib.recursiveUpdate`` function:

.. code:: shell-session

    $ nix repl '<nixpkgs/lib>'
    Welcome to Nix version 2.3.6. Type :? for help.

    Loading '<nixpkgs/lib>'...
    Added 364 variables.

    nix-repl> :p recursiveUpdate { a = { b = 1; }; } { a = { c = 3;}; }
    { a = { b = 1; c = 3; }; }


Reproducability referencing top-level directory with ``./.``
------------------------------------------------------------

Browsing `GitHub source code <https://github.com/search?l=nix&type=Code&q=mkDerivation>`_
you're likely to see the following:

.. code:: nix

   { pkgs ? import <nixpkgs> {}
   }:

   pkgs.stdenv.mkDerivation {
     name = "foobar";

     src = ./.;
  }

If working directory is ``/home/myuser/mywork/myproject``, then
the derivation of ``src`` will be named ``/nix/store/n1caswkqqp8297833y24wyg9xxhs2dc6-myproject``.

The problem is that now your build is no longer reproducible, 
as it depends on the parent directory name that you don't have
control of in the source code.

If someone builds the project in a differently named folder, they will get a different hash of the
``src`` and everything that depends on it.

A better way is to use ``builtins.path``:

.. code:: nix

   { pkgs ? import <nixpkgs> {}
   }:

   pkgs.stdenv.mkDerivation {
     name = "foobar";

     src = builtins.path { path = ./.; name = "myproject"; };
  }


If you're using git to track your code,
you may also want to look at `gitignoresource <https://github.com/hercules-ci/gitignore.nix>`_,
which does this for you. 
