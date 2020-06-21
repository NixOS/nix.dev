Declarative and reproducible developer environments
===================================================

Nix can create reproducible environments given a declarative
configuration called a Nix expression.

Reproducible means you can share
the configuration with others and guarantee that they are using the same
software as you.

To get started, make a new folder and create a file called ``shell.nix``
with the following contents:

.. code:: nix

   { pkgs ? import <nixpkgs> {} }:

   pkgs.mkShell {
     buildInputs = [
       pkgs.which
       pkgs.htop
     ];
   }

Basically we import our package channel ``nixpkgs`` and make a shell
with ``which`` and ``htop`` as inputs. To enter this environment, type
in:

.. code:: bash

   nix-shell

The command will start downloading the missing packages from the default binary cache.


Once it's' done, you are dropped into a new
shell. This shell provides the packages specified in ``shell.nix``.

Run ``htop`` to confirm it is present. Quit the program again by hitting
Q.

Now try ``which htop`` to check where the ``htop`` command is on-disk.
You should see something similar to this:

.. code:: bash

   /nix/store/y3w2i8kfdbfj9rx287ad52rahjpgv423-htop-2.2.0/bin/htop

This is the path to the binary in the Nix store. Nix installs all
packages into the store using a combination of its hash, name and
version.

You can search for available packages using ``nix-env -qa``, for
example:

.. code:: bash

   nix-env -qa python3
   nix-env -qa nodejs
   nix-env -qa ghc
   nix-env -qa cargo
