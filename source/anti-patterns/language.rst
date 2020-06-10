Nix expressions
===============


Unqouted URLs
-------------

Nix syntax supports URLs as verbatim, so one can write ``https://example.com`` instead of ``"https://example.com"``

There's was an `RFC 45 <https://github.com/NixOS/rfcs/pull/45>`_ accepted to deprecate verbatim URLS and provides
a number of arguments this features does more harm than good.


``with`` expression
-------------------

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