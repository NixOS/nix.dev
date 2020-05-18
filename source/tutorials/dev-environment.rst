Setup a development environment
===============================

As an exercise, let us build a Python web application using the Flask
web framework.

Create a new file ``default.nix``. This file is conventionally used for
specifying packages:

.. code:: nix

   { pkgs ? import <nixpkgs> {} }:

   pkgs.python3Packages.buildPythonApplication {
     pname = "myapp";
     src = ./.;
     version = "0.1";
     propagatedBuildInputs = [ pkgs.python3Packages.flask ];
   }

You will also need a simple Flask app as ``main.py``:

.. code:: python

   #! /usr/bin/env python

   from flask import Flask

   app = Flask(__name__)

   @app.route("/")
   def hello():
       return "Hello, Nix!"

   def run():
       app.run(host='0.0.0.0')

and a ``setup.py`` script:

.. code:: python

   from setuptools import setup

   setup(
       name='myapp',
       version='0.1',
       py_modules=['myapp'],
       entry_points={
           'console_scripts': ['myapp = myapp:run']
       },
   )

Now build the package with:

.. code:: bash

   nix-build

This will create a symbolic link ``result`` to our package's path in the
Nix store, which looks like
``/nix/store/6i4l781jwk5vbia8as32637207kgkllj-myapp-0.1``. Look around
to see what is inside.

You may notice we can run the application from the package like
``./result/bin/main.py``. We can still use the ``default.nix`` as a
shell environment to get the same result:

.. code:: bash

   nix-shell default.nix
   python3 main.py

In this context, Nix takes on the role that you would otherwise use pip
or virtualenv for. Nix installs required dependencies and separates the
environment from others on your system.

You can check this Nix configuration into version control and share it
with others to make sure you are all running the same software.
Especially with many dependencies this is a great way to prevent
configuration drift between different team members & contributors.