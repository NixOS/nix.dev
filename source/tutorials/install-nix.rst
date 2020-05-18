Install Nix
===========

While NixOS is a Linux distribution based on Nix, you can install Nix on
other Linux distributions, MacOS and Windows via WSL using the install
script from our website:

.. code:: code

   curl -L https://nixos.org/nix/install | sh

(For security, you may want to `verify the script`_ using our GPG
signatures.)

Check that the installation was successful by running

.. code:: code

   nix-channel --list

This command displays the package distribution channel used by Nix. By
default, this is ``https://nixos.org/channels/nixpkgs-unstable``

.. _verify the script: %5B%root%%5Ddownload.html#nix-verify-installation