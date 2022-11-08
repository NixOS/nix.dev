# Set up a development environment

Let's build a Python web application using the Flask web framework as an exercise.

Create a new file called `default.nix`. This file is conventionally used for specifying packages. Add the code:



```{code-block} nix default.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.python3Packages.buildPythonApplication {
  pname = "myapp";
  src = ./.;
  version = "0.1";
  propagatedBuildInputs = [ pkgs.python3Packages.flask ];
}
```

You will also need a simple Flask app as `myapp.py`:

```{code-block} python myapp.py
#! /usr/bin/env python

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Nix!"

def run():
    app.run(host="0.0.0.0")

if __name__ == "__main__":
    run()
```

And a `setup.py` script:

```{code-block} python setup.py
from setuptools import setup

setup(
    name='myapp',
    version='0.1',
    py_modules=['myapp'],
    entry_points={
        'console_scripts': ['myapp = myapp:run']
    },
)
```

Now build the package with:

```shell-session
$ nix-build
```

This will create a symbolic link `result` to our package's path in the Nix store, which looks like `/nix/store/6i4l781jwk5vbia8as32637207kgkllj-myapp-0.1`. Look around to see what's inside.

You may notice we can run the application from the package like this: `./result/bin/myapp`. But we can also use the `default.nix` as a shell environment to get the same result:

```shell-session
$ nix-shell default.nix
$ python myapp.py
```

In this context, Nix takes on the role that you would otherwise use pip or virtualenv for. Nix installs required dependencies and separates the environment from others on your system.

You can check this Nix configuration into version control and share it with others to make sure you are all running the same software. This is a great way to prevent configuration drift between different team members & contributors, especially when a project has many dependencies.

You can also run a bash script like this one in your CI to make sure your `default.nix` keeps working in the future.

```{code-block} bash test_myapp.sh
#!/usr/bin/env nix-shell
#! nix-shell -i bash
set -euo pipefail

# start myapp in background and save the process id
python myapp.py >> /dev/null 2>&1 &
pid=$!

if [[ $(curl --retry 3 --retry-delay 1 --retry-connrefused http://127.0.0.1:5000) == "Hello, Nix!" ]]; then
    echo "SUCCESS: myapp.py is serving the expected string"
    kill $pid
    exit 0
else
    echo "FAIL: myapp.py is not serving the expected string"
    kill $pid
    exit 1
fi
```
