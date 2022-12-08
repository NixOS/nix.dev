# Set up a development environment

Let's build a Python web application using the Flask web framework as an exercise.

For our Flask web application, create a new file called `myapp.py` and add the following code:

```{code-block} python myapp.py
#! /usr/bin/env python

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return {
        "message": "Hello, Nix!"
    }

def run():
    app.run(host="0.0.0.0", port=5000)

if __name__ == "__main__":
    run()
```

This is a simple Flask application which serves a JSON document with the message
"Hello, Nix!".

To declare the development environment, create a new file `shell.nix`: 

```{code-block} nix shell.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [
    (pkgs.python3.withPackages (ps: [
      ps.flask
    ]))

    pkgs.curl
    pkgs.jq
  ];
}
```

This creates a shell environment with `python3`, including the `flask` package.

However, it also contains developer tools: `curl` (utility to perform web
requests) and `jq` (utility to parse and format JSON documents). Both of them
are not Python packages and they are not part of the Python ecosystem.

If we went with Python's [virtualenv], it is not possible to have these
utilities to be a part of the development environment without additional manual
steps.

We can now use the `nix-shell` to launch the newly created shell environment:

```shell-session
$ nix-shell
these 2 derivations will be built:
  /nix/store/w1k2wq0pw53p4h097p9lnfgypzqq6a43-builder.pl.drv
  /nix/store/911clx564fkrlczx0vwqxsm9wi9ik93c-python3-3.10.6-env.drv
these 93 paths will be fetched (120.19 MiB download, 519.24 MiB unpacked):
  /nix/store/0h73sj1n8hzc6fs36cjvsvcvz3av7n47-bash-interactive-5.1-p16
...

[nix-shell:~/dev-environment]$ 
```

As you can see, Nix will build a working shell environment with the packages you
defined in `shell.nix`.

Let's use the shell environment to start the web application:

```shell-session
[nix-shell:~/dev-environment]$ python ./myapp.py
 * Serving Flask app 'myapp'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.1.100:5000
Press CTRL+C to quit
```

We have a running Python web application now, let's try it out using the
developer tools that are also included.

Launch a new terminal to start another session of the shell environment and
follow the commands below:

```shell-session
$ nix-shell

[nix-shell:~/dev-environment]$ curl 127.0.0.1:5000
{"message":"Hello, Nix!"}

[nix-shell:~/dev-environment]$ curl 127.0.0.1:5000 | jq '.message'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    26  100    26    0     0  13785      0 --:--:-- --:--:-- --:--:-- 26000
"Hello, Nix!"
```

As demonstrated, we can use both `curl` and `jq` to test the running web
application without any manual installation, Nix just does it all for us.

With the files we created, we can add them to a repository and share them to
other people. They can now use the same shell environment as long as they have
Nix installed.

[virtualenv]: https://virtualenv.pypa.io/en/latest/
