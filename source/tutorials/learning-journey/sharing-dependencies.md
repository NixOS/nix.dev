# Sharing dependencies between `default.nix` and `shell.nix`

<!-- Include any foreward you want here -->

## Overview

### What will you learn?

In this tutorial you'll learn how not to repeat yourself by sharing dependencies between `default.nix`, which is responsible for building the project, and `shell.nix`, which is responsible for providing you with an environment to work in.

### How long will it take?

This tutorial will take approximately 1 hour.

### What will you need?

This tutorial assumes you're familiar with Nixpkgs build helpers (`mkDerivation`, `buildPythonApplication`, etc) and know how to create environments for `nix-shell`.
While this tutorial uses Python as the language for the example project, no actual Python knowledge is requried.

## Setting the stage

Suppose you have a working build for your project in a `default.nix` file so that when you run `nix-build` it builds your project.
It includes all of the dependencies needed to build it, but nothing more.
Now suppose you wanted to bring in some tools during development, such as a linter, a code formatter, [git commit hooks], etc.

[git commit hooks]: https://github.com/cachix/pre-commit-hooks.nix

One solution could be to add those packages to your build.
This would certainly work in a pinch, but now your build depends on packages that aren't actually required.
A better solution is to add those development packages to a shell environment so that the build dependencies stay as lean as possible.

However, now you need to define a `shell.nix` that not only provides your development packages, but can also build your project.
In other words, you need a `shell.nix` that brings in all of the packages that your build depends on.
You could certainly copy the build dependencies from `default.nix` and copy them into `shell.nix`, but this is less than ideal:
your build dependencies would be defined in two places.
Maintaining duplicate declarations in `default.nix` and `shell.nix` opens the possibility for them to diverge, producing surprising results.

There is a better way!

## Getting started

Create a directory called `shared_project` and enter it:

```console
$ mkdir shared_project
$ cd shared_project
```

You'll be creating a Python web application as an example project, but don't worry, you'll be given all of the code you need and won't need to know Python to proceed.

Create a new directory called `src` and two empty files inside of `src` called `__init__.py` and `app.py`:

```
$ mkdir src
$ touch src/__init__.py
$ touch src/app.py
```

Copy the following contents into `app.py`:

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

This creates a web application that returns `<p>Hello, World!</p>` on the `/` route.

Next create a `pyproject.toml` file with the following contents:

```toml
[build-system]
requires = ["setuptools", "setuptools-scm"]
build-backend = "setuptools.build_meta"

[project]
name = "shared_project"
version = "0.0.1"

[project.scripts]
app = "app:main"
```

This file tells Python how to build the project and what will execute when you run the executable called `app`.

For the Nix part of the project you'll create two files: `package.nix` and `default.nix`.
The actual build recipe will be in `package.nix` and `default.nix` will import this file to perform the build.

First create a `package.nix` file like this:

```nix
{
  buildPythonApplication,
  setuptools-scm,
  flask,
}:

buildPythonApplication {
  pname = "shared_project";
  version = "0.0.1";
  format = "pyproject";
  src = builtins.path { path = ./.; name = "shared_project_source"; };
  propagatedBuildInputs = [
    setuptools-scm
    flask
  ];
}
```

The Nix expression in this file is a _function_ that produces a derivation.
This method of defining builds is a common design pattern in the Nix community, and is the format used throughout the `nixpkgs` repository.
This particular derivation builds your Python application and ensures that `flask`, the library used to create the web application, is available at runtime.

Note that on line 11 of the `package.nix` file the `src` attribute is set using `builtins.path`.
This creates a [reproducible source path], and is a good habit to form.

[reproducible source path]: https://nix.dev/recipes/best-practices#reproducible-source-paths

Finally, create a `default.nix` that looks like this:

```nix
let
  pkgs = import <nixpkgs> {};
in
  {
    build = pkgs.python3Packages.callPackage ./package.nix {};
  }
```

The `python3Packages.callPackage` function determines which arguments the function in `package.nix` takes (in this case, `buildPythonApplication`, `setuptools-scm`, and `flask`) then calls the function in `package.nix` with the corresponding attributes from `python3Packages`.
You can read more about the `callPackage` pattern in the [Nix Pills][nix_pills_callpackage].

Also note that this `default.nix` returns an attribute set with a single attribute called `build`.
This allows adding more attributes later without breaking existing consumers.
Try to build this project by running `nix-build -A build`

[nix_pills_callpackage]: https://nixos.org/guides/nix-pills/callpackage-design-pattern.html

## Adding development packages

As mentioned earlier, you'll want to add some development packages.
Edit `default.nix` to look like this:

```nix
let
  pkgs = import <nixpkgs> {};
  build = pkgs.python3Packages.callPackage ./package.nix {};
in
  {
    inherit build;
    shell = pkgs.mkShell {
      inputsFrom = [ build ];
      packages = with pkgs.python3Packages; [
        black
        flake8
      ];
    };
  }
```

Let's break this all down.

The `pkgs.mkShell` function produces a shell environment, and it's common to put the expression that calls this function in a `shell.nix` file by itself.
However, doing so means that you to declare `pkgs = ...` a second time (first in `default.nix`, then again in `shell.nix`) and if you're pinning `nixpkgs` to a particular revision you may forget to update one of the declarations.

By putting the `build` declaration in the `let` binding on line 3 you're able to use it throughout the attribute set that spans lines 5-14.
Line 6 includes the `build` attribute in the attribute set.
Lines 7-13 produce the shell environment for working on the project.

The real magic is the `inputsFrom` attribute passed to `mkShell` on line 8, which allows you to include build inputs from other derivations in your shell.
**This is what allows you to not repeat yourself.**

Finally, the `packages` attribute passed to `mkShell` is where you list any executable packages you'd like to be available in your shell.

Now create a `shell.nix` file with the following contents:

```nix
(import ./default.nix).shell
```

Since `default.nix` produces an attribute set, the `shell.nix` file is able to evaluate `default.nix` and simply access the `shell` attribute.

Now you can build the project by running `nix-build -A build` and you can enter the shell simply by running `nix-shell`.

## Testing out the shell

Enter the shell with the `nix-shell` command, then verify that you have the `flake8` and `black` programs available:

```console
$ nix-shell
...lots of output from the build
$ which flake8
/nix/store/vmp3jii75jqmi7vi9mg3v9ackal6wl4i-python3.10-flake8-6.0.0/bin/flake8
$ which black
/nix/store/q9vw01b2jz8h7kjq603hs3lz90i4d6d8-python3.10-black-23.1.0/bin/black
```

These are the Nix store paths on the author's machine at the time of writing.
You will likely see different store paths and versions depending on when you execute these commands and the architecture of the machine that the commands are executed on.

## Next steps
- [Nixpkgs Manual - `mkShell`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell)
- [Nix Pills - callPackage Design Pattern][nix_pills_callpackage]
- [Creating shell environments](https://nix.dev/tutorials/first-steps/declarative-shell.html)
