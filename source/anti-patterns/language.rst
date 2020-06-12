Nix language
============


Unqouted URLs
-------------

Nix syntax supports URLs as verbatim, so one can write ``https://example.com`` instead of ``"https://example.com"``

There's was an `RFC 45 <https://github.com/NixOS/rfcs/pull/45>`_ accepted to deprecate verbatim URLS and provides
a number of arguments this features does more harm than good.
 

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

- It's possible to introduce a hard to debug error `infinite recursion` when shadowing a variable,
  simplest example being ``rec { b = b; }``.

- combining with overriding logic such as `overrideAttrs` function in nixpkgs it has suprising behavour
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

- As soon as there are two `with` used, it's not clear anymore from which the variables are coming from.

- Scoping rules around `with` are not intuitive, see `Nix issue for details <https://github.com/NixOS/nix/issues/490>`_

The better way is to use a variable:

.. code:: nix

    let
      pkgs = import <nixpkgs> {};
    in ...