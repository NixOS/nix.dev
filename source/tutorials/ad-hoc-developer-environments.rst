Ad hoc developer environments
=============================

Assuming you have :ref:`Nix installed <install-nix>`, you can use it
to download packages and create new **shell environments** that use these packages.

This is a great way to play with Nix tooling and see some of its potential.


What is a shell environment?
----------------------------

A shell environment gives you access to the exact versions of packages specified by Nix.

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

Here we used the ``-p`` (packages) flag to specify that we needed the ``hello`` dependency. Nix found this, downloaded it, and made it available in a shell environment.


When are shell environments useful?
-----------------------------------

Sometimes you'd like **to use a tool that you do not have installed**. You don't want to
bother installing the software, but you want to use it.

Sometimes you'd like **to try a tool for a few minutes**. For example, there's a new shiny
tool for writing presentation slides. 

Sometimes you'd like **to give someone else a one-liner to install a set of tools** and you want this to work on all Linux distributions and MacOS.

Sometimes you'd like **to provide a script that is reproducible**, meaning it will also provide any tools that it depends on.


Searching package attribute names
---------------------------------

What can you put in a shell environment?”

To start, anything that's in the `official package list <https://nixos.org/nixos/packages.html>`_ can become part of the shell environment.

You can search the package list using:

.. code:: shell-session

    $ nix-env -qaP git
    gitAndTools.gitFull  git-2.25.0
    gitMinimal           git-2.25.0


The first column is the :term:`attribute name` and the second is the :term:`package name` and its version.

Once you are comfortable doing this, you can add other things too. 
For example, packages of your own or custom shell aliases.

.. note::

   The query you use for searching packages is a regex, so be aware when it comes to special characters.


Ad hoc shell environments
-------------------------

Once you have the :term:`attribute name` for packages, you can start a shell:

.. code:: shell-session

    $ nix-shell -p gitMinimal vim nano joe
    these paths will be fetched (44.16 MiB download, 236.37 MiB unpacked):
    ...
    /nix/store/fsn35pc8njnimgn2sn26dlsyxya1wssb-vim-8.2.0013
    /nix/store/wdqjszpr5dlys53d79fym6rv9vyyz29h-joe-4.6
    /nix/store/hx63qkip16i4wifaqgxwrrmxj4az53h1-git-2.25.0

    [nix-shell:~]$ git --version
    git version 2.25.0

    [nix-shell:~]$ which git
    /nix/store/hx63qkip16i4wifaqgxwrrmxj4az53h1-git-2.25.0/bin/git

Note that even if you had git installed before, once in the shell only the exact version installed by Nix is used.

Press ``CTRL-D`` to exit the shell and those packages won't be available anymore.


Beyond tooling: Python libraries
--------------------------------

``nix-shell`` provides a bunch of other bash variables from packages specified.

Let's try a quick example using Python and ``$PYTHONPATH``:

.. code:: shell-session

    $ nix-shell -p 'python38.withPackages (packages: [ packages.django ])' 
    ...

    [nix-shell:~]$ python -c 'import django; print(django)'
    <module 'django' from '/nix/store/c8ipxqsgh8xd6zmwb026lldsgr7hi315-python3-3.8.1-env/lib/python3.8/site-packages/django/__init__.py'>

We create an ad hoc environment with ``$PYTHONPATH`` set and ``python`` available, along with the ``django`` package as well.

The ``-p`` argument can handle more than attribute names. You can use a full Nix expression, but we'll cover that in later tutorials.


Towards reproducibility
-----------------------

Even running in these basic Nix shells, if you handed over these commands to another developer, they could get different results.

These shell environments are **really convenient**, but they are not **perfectly reproducible** in this form.

What do we mean by reproducible? A fully reproducible example would give exactly the same results no matter **when** or **on what machine** you run the command.
The environment provided would be identical each time.

Nix also offers fully reproducible environments, which it calls pure environments.

The following is a fully reproducible example and something that different colleagues with different machines, for example, could share.

.. code:: shell-session

  $ nix-shell --pure -p git -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/82b5f87fcc710a99c47c5ffe441589807a8202af.tar.gz 
  
  [nix-shell:~]$ git --version
  git version 2.25.4

There are two things going on here:

1. ``--pure`` flag makes sure that the bash environment from your system is not inherited. That means only the ``git`` that Nix installed is available inside the shell.
   This is useful for one-liners and scripts that run for example within a CI environment. While developing, however, we'd like to have our editor around and a bunch of other things. Therefore we might skip the flag for development environments but use it in build ones.

2. The ``-I`` flag pins the nixpkgs revision to an **exact git revision**, leaving no doubt which exact version of Nix packages will be used.


Reproducible executables
------------------------

Finally, we can wrap scripts with Nix to provide a reproducible shell environment that we can commit to a git repository
and share with strangers online. As long as they have Nix installed, they'll be able to execute the script without worrying about manually installing and later uninstalling dependencies at all.

.. code:: python

    #! /usr/bin/env nix-shell
    #! nix-shell --pure -i python -p "python38.withPackages (ps: [ ps.django ])"
    #! nix-shell -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/82b5f87fcc710a99c47c5ffe441589807a8202af.tar.gz

    import django

    print(django)

This is essentially the same example as in the previous section, but this time declaratively source controlled! All of the required Nix commands are included as ``#!`` shebang headers in the scripts itself.


Going forward
-------------

We've only covered the bare essentials of Nix here. Once you're comfortable with these examples, take a look at:

- :ref:`pinning-nixpkgs` to see examples of more advanced Nix expressions

.. TODO: reproducible developer environments

- `Garbage Collection <https://nixos.org/nix/manual/#sec-garbage-collection>`_- as when using `nix-shell`, packages are downloaded into `/nix/store`, but never removed.

- See ``man nix-shell`` for all of the options.
