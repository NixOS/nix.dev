# How to use nix-shel in a shebang

The [nix
shell](https://nixos.org/manual/nix/stable/command-ref/nix-shell.html)
is feature provided by the [Nix package
manager](https://nixos.org/guides/how-nix-works.html). It allows users
to enter into a new shell environment containing a set of packages given
on the command line.

You can nix-shell as an interpreter](https://nixos.org/manual/nix/stable/command-ref/nix-shell.html#use-as-a--interpreter)
in the shebang, not only to define the interpreter, but also a list the
dependencies required for the script file.

Imagine a simple shell script downloading an XML file, running a linter
on it and sending an email of the result. It requires `curl`, `xmllint`
and `mail`.

```shell
#!/usr/bin/env nix-shell
#!nix-shell -i bash -p curl libxml2 mailutils

curl http://localhost.example/report.xml | xmllint -

if [ $? -eq 0 ]; then
    echo "The report is valid" | mail someone@localhost.example
else
    echo "The report is invalid" | mail someone@localhost.example
fi
```

By using `nix-shell` as the shebang, you don't have any prerequisites
steps like typing `nix-shell` or installing packages before using the
program.
