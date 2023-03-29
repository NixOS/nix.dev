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
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/eabc38219184cc3e04a974fe31857d8e0eac098d.tar.gz") {} }:

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

However, it also contains developer tools: [`curl`] (utility to perform web
requests) and [`jq`] (utility to parse and format JSON documents). Both of them
are not Python packages and they are not part of the Python ecosystem.

If we went with Python's [virtualenv], it would not be possible to add these utilities
to the development environment without additional manual steps.

[`curl`]: https://curl.se
[`jq`]: https://stedolan.github.io/jq/
[virtualenv]: https://virtualenv.pypa.io/en/latest/

We can now use `nix-shell` to launch the shell environment we just declared:

```shell-session
$ nix-shell
these 2 derivations will be built:
  /nix/store/5yvz7zf8yzck6r9z4f1br9sh71vqkimk-builder.pl.drv
  /nix/store/aihgjkf856dbpjjqalgrdmxyyd8a5j2m-python3-3.9.13-env.drv
these 93 paths will be fetched (109.50 MiB download, 468.52 MiB unpacked):
  /nix/store/0xxjx37fcy2nl3yz6igmv4mag2a7giq6-glibc-2.33-123
  /nix/store/138azk9hs5a2yp3zzx6iy1vdwi9q26wv-hook
...

[nix-shell:~/dev-environment]$ 
```


Let's start the web application within this shell environment:

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

We now have a running Python web application now.
Let's try it out using the developer tools that are also included.

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
application without any manual installation.
Nix does all of that for us.

We can commit the files we created to version control and share them with other people.
Others can now use the same shell environment as long as they have Nix installed.
