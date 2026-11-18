# GitHub metrics

These helper tools show activity metrics on GitHub for repositories the documentation team is working on.
The tools are available in the Nix shell environment for this repository.

The `metrics` tool requires a JSON dump of **all** GitHub issues and pull requests from the given repository (this may take a while, since Nixpkgs has more than 300 000 items):

```shell-session
github-dump
```

Then, to view the metrics, run:

```shell-session
metrics
```

and follow the command-line help.
