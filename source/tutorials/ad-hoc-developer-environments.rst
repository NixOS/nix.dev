Ad hoc developer environments
=============================

Assuming you have :ref:`Nix installed <install-nix>`, it is able to download packages
and provide a new shell with packages available.

This is a great way to play with Nix tooling and see some of its potential.


When are such environments useful?
----------------------------------

Sometimes you'd like **to use a tool, but it's not installed yet**. You don't want to
bother installing software, you only want to have it now.

Sometimes you'd like **to try a tool for a few minutes**. For example, there's a new shiny
tool for writing presentation slides. 

Sometimes you'd like **to give someone a one-liner also with instructions how to install
tools** being used and such that it works between all Linux distributions and on MacOS.

Sometimes you'd like **to provide a script that is reproducible**, meaning it will also provide the tooling.

Searching package attribute names
---------------------------------

To search available packages head over to `official package list <https://nixos.org/nixos/packages.html>`_
or query in your terminal:

.. code:: shell-session

    $ nix-env -qaP git
    gitAndTools.gitFull  git-2.25.0
    gitMinimal           git-2.25.0


The first column is the :term:`attribute name` and the second is :term:`package name` and its version.

.. note::

   Query for searching packages is a regex, so be aware when it comes to special characters.

Ad hoc environments
-------------------

Once you have the :term:`attribute name` for packages, you can start a shell:

.. code:: shell-session

    $ nix-shell -p git vim nano joe
    these paths will be fetched (44.16 MiB download, 236.37 MiB unpacked):
    ...
    /nix/store/fsn35pc8njnimgn2sn26dlsyxya1wssb-vim-8.2.0013
    /nix/store/wdqjszpr5dlys53d79fym6rv9vyyz29h-joe-4.6
    /nix/store/hx63qkip16i4wifaqgxwrrmxj4az53h1-git-2.25.0

    [nix-shell:~]$ git --version
    git version 2.25.0

    [nix-shell:~]$ which git
    /nix/store/hx63qkip16i4wifaqgxwrrmxj4az53h1-git-2.25.0/bin/git

Press ``CTRL-D`` to exit the shell and those packages won't be available anymore.


Beyond tooling: Python libraries
--------------------------------

``nix-shell`` provides a bunch of other bash variables from packages specified.

A quick example using Python and ``$PYTHONPATH``:

.. code:: shell-session

    $ nix-shell -p 'python38.withPackages (ps: [ ps.django ])' 
    ...

    [nix-shell:~]$ python -c 'import django; print(django)'
    <module 'django' from '/nix/store/c8ipxqsgh8xd6zmwb026lldsgr7hi315-python3-3.8.1-env/lib/python3.8/site-packages/django/__init__.py'>

We create ad hoc environment with ``$PYTHONPATH`` set and ``python`` available with ``django`` package as well.

``-p`` argument accepts Nix expression, but going into the Nix language is out of scope of this tutorial.


Improving reproducability
-------------------------

These environments are **really convenient**, but they are **not yet reproducible**.

If you handed over these commands to another developer, they might get different results.

However the following is entirely reproducible and something you can share between collegues:

.. code:: shell-session

  $ nix-shell --pure -p git --run "git --version" -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/82b5f87fcc710a99c47c5ffe441589807a8202af.tar.gz 
  git version 2.25.0

There are a few things going on here:

1. ``--pure`` flag makes sure that bash environnment from your system is not inherited. That means the only ``git`` is available inside the shell.
   This is useful for one-liners and scripts that run for example on a CI. While developing however, we'd like to have our editor around and
   a bunch of other things.

2. ``--run`` will execute a command instead of entering shell. This is only a demonstration how to automate things rather than reproducability improvement.

3. ``-I`` pins nixpkgs revision to an exact git revision, leaving no doubt which version of Nix packages will be used.


Reproducible executables
------------------------

Finally, we can wrap scripts to provide a reproducible environment that we can commit to a git repository.

.. code:: python

    #! /usr/bin/env nix-shell
    #! nix-shell --pure -i python -p "python38.withPackages (ps: [ ps.django ])"
    #! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/82b5f87fcc710a99c47c5ffe441589807a8202af.tar.gz

    import django

    print(django)

This is essentially the same example as in previous section, but this time declaratively source controlled!


Going forward
-------------

.. - Where are these packages coming from? TODO: channels and pinning nixpkgs

.. TODO: reproducible developer environments

- When using `nix-shell`, packages are downloaded into `/nix/store`, but never removed.
  Once enough disk space accumulates, it's time to `Garbage Collect <https://nixos.org/nix/manual/#sec-garbage-collection>`_.