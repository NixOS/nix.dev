(module-system-tutorial)=
# Module system

Much of the power in Nixpkgs and NixOS comes from the module system.

The module system is a Nix language library that enables you to
- Declare one attribute set using many separate Nix expressions.
- Impose dynamic type constraints on values in that attribute set.
- Define values for the same attribute in different Nix expressions and merge these values automatically according to their type.

These Nix expressions are called modules and must have a particular structure.

In this tutorial series you'll learn
- What a module is and how to create one.
- What options are and how to declare them.
- How to express dependencies between modules.

## What do you need?

- Familiarity with data types and general programming concepts
- A {ref}`Nix installation <install-nix>` to run the examples
- Intermediate proficiency in reading and writing the {ref}`Nix language <reading-nix-language>`

## How long will it take?

This is a very long tutorial.
Prepare for at least 3 hours of work.

```{toctree}
:maxdepth: 1
:caption: Lessons
:numbered:
a-basic-module/index.md
deep-dive.md
```
