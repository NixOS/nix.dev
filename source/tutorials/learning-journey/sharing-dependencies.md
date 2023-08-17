# Sharing dependencies between `default.nix` and `shell.nix`

<!-- Include any foreward you want here -->

## Overview

### What will you learn?

In this tutorial you'll learn how not to repeat yourself by sharing dependencies between 'default.nix`, which is responsible for building the project, and `shell.nix`, which is responsible for providing you an environment to work in.

### How long will it take?

This tutorial will take approximately 1 hour.

### What will you need?

This tutorial assumes you've seen a derivation (`mkDerivation`, `buildPythonApplication`, etc) before, and that you've seen `nix-shell` used to create shell environments.
While this tutorial uses Python as the language for the example project, no actual Python knowledge is requried.

## Setting the stage
Suppose you have a working build for your project in a `default.nix` file so that when you type `nix-build` in your shell it builds your project.
It includes all of the dependencies needed to build it, but nothing more.
Now suppose you wanted to bring in some tools during development, such as a linter, a code formatter, etc.

One solution could be to add those packages to your build.
This would certainly work in a pinch, but now your build depends on packages that aren't necessary for it to actually build.
A better solution is to add those development packages to a shell environment so that the build dependencies stay as lean as possible.

However, now you need to define a `shell.nix` that not only provides your development packages, but can also build your project.
In other words, you need a `shell.nix` that brings in all of the packages that your build depends on.
You could certainly copy the build dependencies from `default.nix` and copy them into `shell.nix`, but this is less than ideal.
Your build dependencies are defined in multiple places, and aside from repeating yourself there's now the possiblity that the dependencies in `default.nix` and `shell.nix` may fall out of sync.

There is a better way!

## Getting started

Create a directory called `shared_project` and enter it:
```console
$ mkdir shared_project
$ cd shared_project
```

You'll be creating a Python web application as an example project, but don't worry, you'll be given all of the code you need and won't need to know Python to proceed.

Create a file `app.py` with the following contents:
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
```
This file tells Python how to build the project.

For the Nix part of the project you'll create two files: `build.nix` and `default.nix`.
The actual build recipe will be in `build.nix` and `default.nix` will import this file to perform the build.

First create a `build.nix` file like this:
```nix
{
  python3Packages,
}:

python3Packages.buildPythonApplication {
  pname = "shared_project";
  version = "0.0.1";
  format = "pyproject";
  src = builtins.path { path = ./.; name = "shared_project_source"; };
  propagatedBuildInputs = with python3Packages; [
    setuptools-scm
    flask
  ];
}
```
The Nix expression in this file is a function that takes `python3Packages` as input and produces a derivation.
This method of defining builds is a common design pattern in the Nix community, and is the format used throughout the `nixpkgs` repository.
This particular derivation builds your Python application and ensures that `flask`, the library used to create the web application, is available at runtime for the application.

Finally, create a `default.nix` that looks like this:
```nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.callPackage ./build.nix {}
```
The `callPackage` function reads the expression in `build.nix` to determine which inputs it needs (in this case, python3Packages), then calls the expression with the inputs that were requested.
You can read more about `callPackage` in the [Nix Pills][nix_pills_callpackage].

[nix_pills_callpackage]: https://nixos.org/guides/nix-pills/callpackage-design-pattern.html

If you should now be able to build the project with the `nix-build` command.
If you now execute the `nix-shell` command you should also be put into a shell with the `python3` and `flask` commands available.

## Adding development packages
As mentioned above, you'll want to add some development packages, but you won't want to add them to `build.nix` or `default.nix`.
It's time to create a `shell.nix`.

Create the following `shell.nix` file:
```nix
let
  pkgs = import <nixpkgs> {};
  build = pkgs.callPackage ./build.nix {};
in
  pkgs.mkShell {
    inputsFrom = [
      build
    ];

    packages = with pkgs.python3Packages; [
      black
      flake8
    ];
  }
```

Let's break this down.

In `default.nix` you have a `pkgs = import <nixpkgs> {};` line, which locates a `nixpkgs` revision and evaluates it so that you can use the `pkgs` name in the rest of `default.nix` and use the packages and functions defined in the `nixpkgs` repository. You have the same line in `shell.nix` for the same purpose.

The `build = pkgs.callPackage ./build.nix {};` line is doing something very similar: it's evaluating the Nix expression contained in `build.nix`.
This is necessary because `build.nix` contains a record of the build dependencies that you want to make available in your shell.

The real magic is the `inputsFrom` attribute passed to `mkShell`, which allows you to include build inputs from other derivations in your shell.
This is what allows you to not repeat yourself.
This project is trivially small, so you may not see the benefit of sharing the build dependencies in this way, but imagine if you were working on a larger project with many dependencies, some of which required platform specific configuration.
That would be significantly more complicated to keep in sync if you had written all of those dependencies out in both `shell.nix` and `default.nix`.

Finally, the `packages` attribute is where you list any executable packages that you'd like to be available in your shell.
In this case you've included the `flake8` linter and the `black` formatter.

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

Now you'll test that the commands actually work.
Edit the `app.py` file to look like this:
```python
from flask import Flask

app = Flask(__name__)
@app.route("/")
def hello_world():
    foo       = "bar"
    return "<p>Hello, World!</p>"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```
Note that the file no longer has two blank lines between the `app = ...` line and the `@app.route("/")` line.
This is something that `flake8` will complain about.
Also note that there is now a new line containing `foo       = "bar"`, which contains enough whitespace before the `=` that the `black` formatter will complain.

If you run the `flake8` command you should see the following output indicating the the `flake8` linter is unhappy:
```console
$ flake8 app.py
app.py:4:1: E302 expected 2 blank lines, found 0
app.py:6:5: F841 local variable 'foo' is assigned to but never used
app.py:6:8: E221 multiple spaces before operator
```

If you run the `black` command and have it check formatting rather than _do_ the formatting, it will also complain:
```console
$ black --check app.py
would reformat app.py

Oh no! 💥 💔 💥
1 file would be reformatted.
```

## Where to next?
- [Nixpkgs Manual - `mkShell`](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-mkShell)
- [Nix Pills - callPackage Design Pattern][nix_pills_callpackage]
- [Creating shell environments](https://nix.dev/tutorials/learning-journey/shell-dot-nix.html)
