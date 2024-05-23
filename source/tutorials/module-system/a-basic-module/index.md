# A basic module

What is a module?

* A module is a function that takes an attribute set and returns an attribute set.
* It may declare options, telling which attributes are allowed in the final outcome.
* It may define values, for options declared by itself or other modules.
* When evaluated by the module system, it produces an attribute set based on the declarations and definitions.

The simplest possible module is a function that takes any attributes and returns an empty attribute set:

```{code-block} nix
:caption: options.nix
{ ... }:
{
}
```

To define any values, the module system first has to know which ones are allowed.
This is done by declaring *options* that specify which attributes can be set and used elsewhere.

## Declaring options

Options are declared under the top-level `options` attribute with [`lib.mkOption`](https://nixos.org/manual/nixpkgs/stable/#function-library-lib.options.mkOption).

```{literalinclude} options.nix
:language: nix
:caption: options.nix
```

:::{note}
The `lib` argument is passed automatically by the module system.
This makes [Nixpkgs library functions](https://nixos.org/manual/nixpkgs/stable/#chap-functions) available in each module's function body.

The ellipsis `...` is necessary because the module system can pass arbitrary arguments to modules.

:::

The attribute `type` in the argument to `lib.mkOption` specifies which values are valid for an option.
There are several types available under [`lib.types`](https://nixos.org/manual/nixos/stable/#sec-option-types-basic).

Here we have declared an option `name` of type `str`:
The module system will expect a string when a value is defined.

Now that we have declared an option, we would naturally want to give it a value.

## Defining values

Options are set or *defined* under the top-level `config` attribute:

```{literalinclude} config.nix
:language: nix
:caption: config.nix
```

In our option declaration, we created an option `name` with a string type.
Here, in our option definition, we have set that same option to a string.

Option declarations and option definitions don't need to be in the same file.
Which modules will contribute to the resulting attribute set is specified when setting up module system evaluation.

## Evaluating modules

Modules are evaluated by [`lib.evalModules`](https://nixos.org/manual/nixpkgs/stable/#module-system-lib-evalModules) from the Nixpkgs library.
It takes an attribute set as an argument, where the `modules` attribute is a list of modules to merge and evaluate.

The output of `evalModules` contains information about all evaluated modules, and the final values appear in the attribute `config`.

```{literalinclude} default.nix
:language: nix
:caption: default.nix
```

Here's a helper script to parse and evaluate our `default.nix` file with [`nix-instantiate --eval`](https://nixos.org/manual/nix/stable/command-ref/nix-instantiate) and print the output as JSON:

```{literalinclude} eval.sh
:language: bash
:caption: eval.sh
```

As long as every definition has a corresponding declaration, evaluation will be successful.
If there is an option definition that has not been declared, or the defined value has the wrong type, the module system will throw an error.

Running the script (`./eval.sh`) should show an output that matches what we have configured:

```{code-block}
{
  "name": "Boaty McBoatface"
}
```
