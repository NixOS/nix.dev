# Sharing dependencies between `default.nix` and `shell.nix`

## Assumptions
- The reader has seen a derivation before.
- The reader understands that builders (also referred to as "build helpers") come from `nixpkgs`.
- The reader knows what a declarative shell environment is.

## Activity

<!-- What is the activity you're going to walk the reader through. -->
- Start with a `default.nix` that builds a project.
- Show the reader how to share dependencies between a build and a shell environment.

## Purpose

<!-- What is the reader supposed to gain from reading this? --> 
- Show the reader how to set up a development environment.
- Show the reader how not to repeat themselves.
- Show the reader how to import one Nix file into another.

## Steps

<!-- Prepare a bulleted outline of how you're going to walk the reader through this activity. -->
<!-- Be specific about how you're going to teach this activity, we want to catch any pitfalls before the writing phase. -->
- Begin with a `default.nix` that builds an application.
- Show the reader that the application builds.
- Present a scenario that prompts for a better working environment.
    - We'd like to include modern development tooling like a test runner, linter, and formatter.
    - Demonstrate that in order to bring those tools into our environment with the current `default.nix` those packages would also be included in the build even though they aren't necessary to build our application. 
        - (Optional) Add the packages to `propagatedBuildInputs` and show that they're included in the closure.
- Create a `shell.nix` to separate build dependencies from development dependencies.
    - Duplicate dependencies from `default.nix` so that you can still perform the build in `shell.nix`.
    - Add the development tools to `shell.nix` so that the reader has access to the during development.
    - Demonstrate that you can still build the application.
    - Explain that having to repeat yourself in both files is less than ideal and that you could easily forget to add a dependency to one file or the other.
- Explain that one solution is to repeat yourself, but that it isn't ideal and you should avoid it.
    - Explain that you could:
        - Create a separate `shell.nix`
        - Duplicate the build dependencies
        - Then include the development tools
    - Explain that the drawback is that the build dependencies could fall out of sync between `default.nix` and `shell.nix` by mistake.
- Introduce `mkShell.inputsFrom` as a way to prevent duplication.
    - Explain that `inputsFrom` extracts `input` attributes from the supplied derivation and passes them to `mkShell`.
- Demonstrate how to import the `default.nix` expression into `shell.nix` and use its inputs.
- Demonstrate how to put the `mkShell` call in `default.nix`.
    - Explain that defining the shell this way helps to keep more of the functionality in `default.nix`, leaving `shell.nix` to be the necessary glue to allow `nix-shell` to use the shell we've defined.

In the end you should end up with files that look like this (examples are Python just for demonstration purposes here):
```
# default.nix
let
  myPackage = python3Packages.buildPythonApplication {
    propagatedBuildInputs = [
      python3Packages.flask
    ];
  };
in myPackage // {
  shell = mkShell {
    inputsFrom = [
      myPackage
    ];
    buildInputs = [
      curl
    ];
  };
}

# shell.nix
(import ./default.nix).shell
```
