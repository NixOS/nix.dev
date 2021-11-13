.. _install-nix:

Install Nix
===========

Linux (manual installation)
---------------------------

Install Nix on via the recommended `multi-user installation <https://nixos.org/manual/nix/stable/#chap-installation>`_:

.. code:: bash

   sh <(curl -L https://nixos.org/nix/install) --daemon

.. note::

  For security you may want to `verify the installation script`_ using GPG signatures.


Linux using your package manager
--------------------------------

If Nix is available in your favorite distribution, you can alternatively use its package manager;
for instance on debian based distributions:

.. code:: bash

   sudo apt install nix

.. note::

  This guide was written assuming a manual installation; if you use your package manager, you must also:

  - make sure that the nix daemon is running (many distributions will do that for you);
  - subscribe to a channel and update its list of packages as shown in nix-channel(1):

    .. code:: base
      nix-channel --add https://nixos.org/channels/nixpkgs-unstable && nix-channel --update
  - (possibly) setup some environment variables, typically by sourcing some file
    in /etc/profile.d;
    first try logging out and logging back again to see if your distribution does that automatically for you.
  If your computer is used by multiple people each user must perform the last two steps.

  Some distributions may require additional steps - on debian, for instance, you need to add yourself to the nix-users group:

.. code:: bash

   usermode -G nix-users --append your_username


macOS
-----

Install Nix on via the recommended `multi-user installation <https://nixos.org/manual/nix/stable/#chap-installation>`_:

.. code:: bash

   sh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume --daemon


.. note::

   For security you may want to `verify the installation script`_ using GPG signatures.


Windows (WSL2)
--------------

Install Nix on via the recommended `single-user installation <https://nixos.org/manual/nix/stable/#chap-installation>`_:

.. code:: bash

  sh <(curl -L https://nixos.org/nix/install) --no-daemon

.. note::

   For security you may want to `verify the installation script`_ using GPG signatures.


Docker
------

Start a Docker shell with Nix:

.. code:: bash

      $ docker run -it nixos/nix

Or start a Docker shell with Nix exposing a ``workdir`` directory:

.. code:: bash

      $ mkdir workdir
      $ docker run -it -v $(pwd)/workdir:/workdir nixos/nix

The ``workdir`` example from above can be also used to start hacking on nixpkgs:

.. code:: bash

      $ git clone git@github.com:NixOS/nixpkgs
      $ docker run -it -v $(pwd)/nixpkgs:/nixpkgs nixos/nix
      docker> nix-build -I nixpkgs=/nixpkgs -A hello
      docker> find ./result # this symlink points to the build package
   
Verify installation
-------------------

Check that the installation by opening **a new terminal** and typing:


.. code:: bash

   $ nix-env --version
   nix-env (Nix) 2.3.15

.. _verify the installation script: https://nixos.org/download.html#nix-verify-installation
