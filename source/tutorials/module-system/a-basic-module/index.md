# A basic module

What is a module?

* A module is a function that takes an attrset and returns an attrset.
* It *may* declare options.
* It *may* define option values.
* When evaluated, it produces a configuration based on the declarations and definitions.

The format is like so:

```{code-block} nix
:caption: useless.nix
{...}: {
}
```

This, as the filename suggests, is completely useless.
It takes no arguments and returns an empty attrset.
However, it is a valid module.
Let us add to this to make it a bit more useful.

To define any values, the module system first has to know which ones are allowed.
This is done by declaring options that specify which values can be set and used elsewhere.
Options are declared by adding an attribute under the top-level `options` attribute.
The most general way to declare an option is using `lib.mkOption`.

```{literalinclude} options.nix
:language: nix
:caption: options.nix
```

While many attributes for customizing options are available,
the most important one is `type`,
which specifies which values are valid for an option.
There are several types available under [`lib.types`][option-types-basic] in the Nixpkgs library.

As you can see, we have declared an option `name`.
We have specificied that the `name` option will be of type `str`, so the module system will expect a string when we set a value.

You may have noticed that we also changed the function arguments.
Now the module is a function which takes *at least* one argument, `lib`,
and may accept other arguments (expressed by the ellipsis `...`).
This will make Nixpkgs library functions available within the function body.
We needed this to get access to `mkOption` and `types`.

:::{note}
The ellipsis `...` is necessary because arbitrary arguments can be passed to modules.
Every module should have this.

The `lib` argument is passed automatically by the module system.
It is absolutely vital for modules that have option declarations, as you will need `lib` for defining options and their types.
It is one of several arguments that are automatically provided by the module system.
The full list of arguments is discussed later.
:::

Now that we have declared an option, we would naturally want to give it a value.
Options can be set or *defined* using another top-level attribute, `config`.

```{literalinclude} config.nix
:language: nix
:caption: config.nix
```

Previously, in our option declaration, we created an option, `name`, with a string type.
Here, in our option definition, we have set that same option to a string.

:::{note}
`options` and `config` and have formal names —
that is ***option declarations*** and ***option definitions*** respectively.
The rest of these lessons will use them interchangeably.
:::

:::{note}
Our option declarations and option definitions do not need to exist in the same file.
When we evaluate our modules, we can simply include both files.
As long as every definition has a declaration, we can successfully evaluate our modules.
If there is an option definition that has not been declared, the module system will throw an error.
:::

Now that we have our declaration and definition, how do we evaluate them?
There is a function provided by the Nixpkgs library, `evalModules`.
It takes an attrset as an argument and one of the attributes is `modules` which is a list of modules you want to merge and evaluate.
The output of `evalModules` is a rather large attrset with a information about all the modules.
For now, the attribute we care about is `config` which is where the final configuration values appear.

```{literalinclude} eval.nix
:language: nix
:caption: eval.nix
```

We can create a helper script to parse and evaluate our `eval.nix` file and print the output in a nice format.

```{literalinclude} run.sh
:language: bash
:caption: run.sh
```

If you execute the run file (`./run.sh`), you should see an output that matches what we have configured.

```{code-block}
{
  "name": "Boaty McBoatface"
}
```

[option-types-basic]: https://nixos.org/manual/nixos/stable/#sec-option-types-basic

