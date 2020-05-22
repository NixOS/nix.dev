Ad hoc developer environments
=============================

Assuming you have :ref:`Nix installed <install-nix>`, it is able to download packages
and provide a new **shell environment** with packages available.

This is a great way to play with Nix tooling and see some of its potential.


What is a shell environment?
----------------------------

A hello world example:

.. code:: shell-session

    $ hello             
    The program ‘hello’ is currently not installed.

    $ nix-shell -p hello             

    [nix-shell:~]$ hello
    Hello, world!

    [nix-shell:~]$ exit
    exit

    $ hello             
    The program ‘hello’ is currently not installed.


When are shell environments useful?
-----------------------------------

Sometimes you'd like **to use a tool, but it's not installed yet**. You don't want to
bother installing software, you only want to have it now.

Sometimes you'd like **to try a tool for a few minutes**. For example, there's a new shiny
tool for writing presentation slides. 

Sometimes you'd like **to give someone a one-liner also with instructions how to install
tools** being used and such that it works between all Linux distributions and on MacOS.

Sometimes you'd like **to provide a script that is reproducible**, meaning it will also provide the tooling.


Searching package attribute names
---------------------------------

What can you put in a shell environment?”

To start, anything that's in the `official package list <https://nixos.org/nixos/packages.html>`_ can become part of the shell environment.

You can search the package list using:

.. code:: shell-session

    $ nix-env -qaP git
    gitAndTools.gitFull  git-2.25.0
    gitMinimal           git-2.25.0


The first column is the :term:`attribute name` and the second is :term:`package name` and its version.

Once you are comfortable doing this, you can add other things too. 
For example, packages of your own or custom shell aliases.

.. note::

   Query for searching packages is a regex, so be aware when it comes to special characters.


Ad hoc shell environments
-------------------------

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

    $ nix-shell -p 'python38.withPackages (packages: [ packages.django ])' 
    ...

    [nix-shell:~]$ python -c 'import django; print(django)'
    <module 'django' from '/nix/store/c8ipxqsgh8xd6zmwb026lldsgr7hi315-python3-3.8.1-env/lib/python3.8/site-packages/django/__init__.py'>

We create ad hoc environment with ``$PYTHONPATH`` set and ``python`` available with ``django`` package as well.

``-p`` argument accepts Nix expression, but going into the Nix language is out of scope of this tutorial.


Towards reproducability
-----------------------

If you handed over these commands to another developer, they might get different results.

These shell environments are **really convenient**, but they are **not yet reproducible**.

What do we mean by reproducible? No matter when or on what machine you run the command, the result will be the same.
The very same environment will be provided each time.

The following is entirely reproducible and something you can share between colleagues:

.. code:: shell-session

  $ nix-shell --pure -p git --run "git --version" -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/82b5f87fcc710a99c47c5ffe441589807a8202af.tar.gz 
  
  [nix-shell:~]$ git --version
  git version 2.25.0

There are two things going on here:

1. ``--pure`` flag makes sure that bash environnment from your system is not inherited. That means the only ``git`` is available inside the shell.
   This is useful for one-liners and scripts that run for example on a CI. While developing however, we'd like to have our editor around and
   a bunch of other things so we skip the flag.

2. ``-I`` pins nixpkgs revision to an exact git revision, leaving no doubt which version of Nix packages will be used.


Reproducible executables
------------------------

Finally, we can wrap scripts to provide a reproducible shell environment that we can commit to a git repository
and share with strangers online. As long as they have Nix installed, they'll be able to execute the script without 
worrying about manually installing and later uninstalling dependencies at all.

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

- See ``man nix-shell`` for more options