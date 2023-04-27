(writing-nix-configuration)=

Sources (remove this later)

- https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules
- https://nixos.org/manual/nixos/stable/index.html#ch-configuration
- https://nixos.wiki/wiki/NixOS_modules
- https://github.com/NixOS/nixpkgs/pull/202204
- https://www.youtube.com/watch?v=cZjOzOHb2ow&t=117s
- https://github.com/tweag/summer-of-nix-modules

# NixOS modules

NixOS has a modular system for declarative configuration.
This system combines multiple modules to produce the full system configuration.
One of the modules that constitute the configuration is /etc/nixos/configuration.nix.
Most of the others live in the nixos/modules subdirectory of the Nixpkgs tree.

Each NixOS module is a file that handles one logical aspect of the configuration,
such as a specific kind of hardware, a service, or network settings.

A module configuration does not have to handle everything from scratch;
it can use the functionality provided by other modules for its implementation.

Thus a module can declare options that can be used by other modules,
and conversely can define options provided by other modules in its own implementation.

For example, the module `pam.nix` declares the option `security.pam.services`,
that allows other modules (e.g. sshd.nix) to define PAM services;
and it defines the option `environment.etc` (declared by `etc.nix`) to cause files to be created in `/etc/pam.d`.

## Module format

A NixOS module can be abbreviated a few ways.  The full declaration of a module looks as follows:

```nix
{ config, pkgs, ... }: {

  imports = [];

  options = {
    # ...
  };
  
  config = {
    # ...
  };
}
```

The meaning of each part is as follows.

- The first line makes the current Nix expression a function.
  The variable `pkgs` contains Nixpkgs, while `config` contains the full system configuration.
  This line can be omitted if there is no reference to `pkgs` and `config` inside the module.

- This `imports` list enumerates the paths to other NixOS modules that should be included in the evaluation of the system configuration.
  A default set of modules is defined in the file modules/module-list.nix.
  These don't need to be added in the import list.

- The attribute `options` is a nested set of option _declarations_.

- The attribute `config` is a nested set of option _definitions_.

You can think of the difference between `option` and `config` as the schema and data of your Nix configuration.
Keys in the `option` tree define _which_ settings are valid, and what types they are expected to have.
The `config` tree then lets you specify which options you want to define, and the precise values of those definitions.

### Module abbreviation

As mentioned in the previous section, modules can be abbreviated (and you likely have already encountered these).

```nix
{ config, pkgs, ... }: {
  imports = [ /* ... */];
  
  # ...
}
```

When a module doesn't _declare_ any options (i.e. the `options` key is missing), _definition_ of options (the `config` key) becomes implicit.

In these cases the module may still define the `imports` key to include other modules,
while the body of the module implicitly becomes the `config` key.

This may explain why the structure of `/etc/nixos/configuration.nix` looks slightly different than the full module outlined above.

### Writing a simple module

If you are mainly interested in configuring your NixOS system you can skip this section.

...

## Configuring a NixOS system

The NixOS configuration file `/etc/nixos/configuration.nix` is actually a Nix expression, 
which is the Nix package manager’s purely functional language for describing how to build packages and configurations.

This means you have all the expressive power of that language at your disposal,
including the ability to abstract over common patterns, which is very useful when managing complex systems.

The syntax and semantics of the Nix language are fully described in the Nix manual,
but here we give a short overview of the most important constructs useful in NixOS configuration files.

