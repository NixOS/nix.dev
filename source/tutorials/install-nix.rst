.. _install-nix:

Install Nix
===========

Install Nix on **any Linux distribution**, **MacOS** and **Windows (via WSL)**
via the recommended `multi-user installation <https://nixos.org/nix/manual/#chap-installation>`_:

.. code:: bash

   sh <(curl -L https://nixos.org/nix/install) --daemon

.. note:: 

  Due to `MacOS Catalina read-only system volume <https://github.com/NixOS/nix/issues/2925>`_,
  there are extra installation steps by running `create-darwin-volume.sh <https://github.com/NixOS/nix/pull/3212>`_
  
  For security you may want to `verify installation script`_ using GPG signatures.

Verify installation
-------------------

Check that the installation was successful:

.. code:: bash

   $ nix-env --version
   nix-env (Nix) 2.3.4

.. _verify installation script: https://nixos.org/download.html#nix-verify-installation