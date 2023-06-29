# First Steps - Trivial Builders

## Assumptions

* The reader knows what a shell environment is.
* The reader has some familiarity with `nix-shell`

## Activity

* Start with a `shell.nix` which brings in some packages and dependencies for a `Process X`
  * `Process X` should be capable of accepting a config file
* Show the reader how to create a series of utility scripts for starting/stopping and generally streamlining everyday dev tasks with `Process X` and demonstrate how the config file can be generated with Nix.

## Purpose

* Show the reader how trivial builders are the everyday glue that makes writing devshells, packages and NixOS modules easier, cleaner and simpler to follow. 

## Steps

* Begin with a `shell.nix` which provides the dependencies for `Process X`
* Show the reader how to generate the config file using `writeTextFile`
* Show the reader how to take the generated config file and create a start script for `Process X` using `writeScript`
  * When they reload their shell and try to run the new script, they should see that it fails
  * This is a good opportunity to introduce `writeScriptBin` and highlight how it is necessary to ensure their script is placed in `$out/bin` to be picked up by `mkShell`.
* Having created a working start script using `writeScriptBin` we point out that the generated script does not contain an interpreter:
  * `cat $(which start-server)` 
  * This is an opportunity to introduce `writeShellScriptBin` and show how the resulting script contains the interpreter with `cat $(which start-server)` 
* Until now, the binary for `Process X` should have been referred to directly in the start script e.g. `${pkgs.process-x}/bin/process-x`
  * We can now introduce the reader to `writeShellApplication`, providing the binary for `Process X` as a `runtimeInput`
  * A few things should now be highlighted:
    * Show how the `PATH` is being generated in the output script
    * Demonstrate the inclusion of default shellopts
    * Demonstrate how `shellcheck` is being applied by first encouraging the reader to try a script that will fail the check.
* To round things off, we can demonstrate the use of `symlinkJoin` to combine a few utility scripts to together into a single package. Whilst not strictly necessary for a devshell, I think it’s still worthwhile to point out
  * Have the reader create a `start` and `stop` `/bin/` script for `Process X` which starts in daemon mode and stops the daemon at a later point. It can be as simple as grabbing a pid and running kill.
  * Demonstrate how both scripts have different store paths.
  * Next, refactor the devshell to include the `start` and `stop` packages using `symlinkJoin`, highlighting how they now share the same store path and have been symlinked in.
