.. _install-nix:

Install Nix
===========

Install Nix on **any Linux distribution**, **MacOS** and **Windows (via WSL)**
via the recommended `multi-user installation <https://nixos.org/manual/nix/stable/#chap-installation>`_:

.. code:: bash

   sh <(curl -L https://nixos.org/nix/install) --daemon

.. note::

  For security you may want to `verify installation script`_ using GPG signatures.

Verify installation
-------------------

Check that the installation was successful:

.. code:: bash

   $ nix-env --version
   nix-env (Nix) 2.3.6

.. _verify installation script: https://nixos.org/download.html#nix-verify-installation
