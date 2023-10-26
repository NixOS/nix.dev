# Deep dive demo: Wrapping the world in modules

Much of the power in Nixpkgs and NixOS comes from the module system.
It provides mechanisms for conveniently declaring and automatically merging interdependent attribute sets that follow dynamic type constraints, making it easy to express modular configurations.

In this tutorial you'll learn
- what a module is
- how to define one
- what options are
- how to declare them
- how to express dependencies between modules
and follow extensive demonstration of how to wrap an existing API with Nix modules.

Concretely, you'll write modules to interact with the Google Maps API, declaring options which represent map geometry, location pins, and more.

:::{warning}
To run the examples in this tutorial, you will need a [Google API key](https://developers.google.com/maps/documentation/maps-static/start#before-you-begin) in `$XDG_DATA_HOME/google-api/key`.
:::

Be prepared to see some Nix errors: during the tutorial, you will first write some *incorrect* configurations, creating opportunities to discuss the resulting error messages and how to resolve them, particularly when discussing type checking.

:::{note}
This tutorial follows [@infinisil](https://github.com/infinisil)'s [presentation on modules](https://infinisil.com/modules.mp4)  [(source)](https://github.com/tweag/summer-of-nix-modules) for 2021 Summer of Nix.
:::

You will use need two helper scripts for this exercise.
Download {download}`map <files/map>` and {download}`geocode <files/geocode>` into your working directory.

## Empty module

We have to start somewhere.
The simplest module is just a function that takes any attributes and returns an empty attribute set.

Write the following into a file called `default.nix`:

```nix
# default.nix
{ ... }:
{

}
```

## Module Arguments

We will need some helper functions, which will come from the Nixpkgs library.
Start by changing the first line in `default.nix`:

```diff
# default.nix
- { ... }:
+ { lib, ... }:
{

}
```

Now the module is a function which takes *at least* one argument, called `lib`, and may accept other arguments (expressed by the ellipsis `...`).

On NixOS, `lib` argument is passed automatically.
This will make Nixpkgs library functions available within the function body.

:::{note}
The ellipsis `...` is necessary because arbitrary arguments can be passed to modules.
:::

## Declaring Options

To set any values, the module system first has to know which ones are allowed.

This is done by declaring *options* that specify which values can be set and used elsewhere.
Options are declared by adding an attribute under the top-level `options` attribute, using `lib.mkOption`.

In this section, you will define the `generate.script` option.

Change `default.nix` to include the following declaration:

```diff
# default.nix
 { lib, ... }: {

+ options = {
+   generate.script = lib.mkOption {
+     type = lib.types.lines;
+   };
+ };

 }
```

While many attributes for customizing options are available, the most important one is `type`, which specifies which values are valid for an option.
There are several types available under [`lib.types`](https://nixos.org/manual/nixos/stable/#sec-option-types-basic) in the Nixpkgs library.

You have just declared `generate.script` with the `lines` type, which specifies that the only valid values are strings, and that multiple definitions should be joined with newlines.

Write a new file, `eval.nix`, which you will use to evaluate `default.nix`:

```nix
# eval.nix
let
  nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
  pkgs = import nixpkgs { config = {}; overlays = []; };
in
pkgs.lib.evalModules {
  modules = [
    ./default.nix
  ];
}
```

[`evalModules`] is the function that evaluates modules, applies type checking, and merges values into the final attribute set.
It expects a `modules` attribute that takes a list, where each element can be a path to a module or an expression that follows the [module schema](https://nixos.org/manual/nixos/stable/#sec-writing-modules).

Now run the following command:

```bash
nix-instantiate --eval eval.nix -A config.generate.script
```

You will see an error message indicating that the `generate.script` option is used but not defined; you will need to assign a value to the option before using it.

## Type Checking

As previously mentioned, the `lines` type only permits string values.

:::{warning}
In this section, you will set an invalid value and encounter a type error.
:::

What happens if you instead try to assign an integer to the option?

Add the following lines to `default.nix`:

```diff
# default.nix
 { lib, ... }: {

  options = {
    generate.script = lib.mkOption {
      type = lib.types.lines;
    };
  };

+ config = {
+   generate.script = 42;
+ };
 }
```

Now try to execute the previous command, and witness your first module error:

```console
$ nix-instantiate --eval eval.nix -A config.generate.script
error:
...
       error: A definition for option `generate.script' is not of type `strings concatenated with "\n"'. Definition values:
       - In `/home/nix-user/default.nix': 42
```

This assignment of `generate.script = 42;` caused a type error: integers are not strings concatenated with the newline character.

## Successful Type-checking

To make this module pass the type-checker and successfully evaluate the `generate.script` option, you will now assign a string to `generate.script`.

In this case, you will assign a `map` script which first calls the Google Maps Static API to generate a world map, then displays the result using `icat` (image-cat), both of which are helper scripts.

Update `default.nix` by changing the value of `generate.script` to the following string:

```diff
# default.nix
   config = {
-    generate.script = 42;
+    generate.script = ''
+      ./map size=640x640 scale=2 | feh -
+    '';
   };
```

## Interlude: Reproducible scripts

The simple script will likely not work as intended on your system, as it may lack the required dependencies.
We can solve this by packaging the raw {download}`map <files/map>` script with `pkgs.writeShellApplication`.

First, make available a `pkgs` argument in your module evaluation by adding a module that sets `config._module.args`:

```diff
# eval.nix
 pkgs.lib.evalModules {
   modules = [
+    ({ config, ... }: { config._module.args = { inherit pkgs; }; })
     ./test.nix
   ];
 }
```

Then change `default.nix` to have the following contents:

```nix
# default.nix
{ pkgs, lib, ... }: {

  options = {
    generate.script = lib.mkOption {
      type = lib.types.package;
    };
  };

  config = {
    generate.script = pkgs.writeShellApplication {
      name = "map";
      runtimeInputs = with pkgs; [ curl feh ];
      text = ''
        ${./map} size=640x640 scale=2 | feh -
      '';
    };
  };
}
```

This will access the previously added `pkgs` argument so we can use dependencies, and copy the `map` file in the current directory into the Nix store so it's available to the wrapped script, which will also live in the Nix store.

Run the script with:

```console
nix-build eval.nix -A config.generate.script
./result/bin/map
```

To iterate more quickly, open a new terminal and set up [`entr`](https://github.com/eradman/entr) to re-run the script whenever any source file in the current directory changes:

```console
nix-shell -p entr findutils bash --run \
  "ls *.nix | \
   entr -rs ' \
     nix-build eval.nix -A config.generate.script --no-out-link \
     | xargs printf -- \"%s/bin/map\" \
     | xargs bash \
   ' \
  "
```

This command does the following:
- List all `.nix` files
- Make `entr` watch them for changes. Terminate the invoked command on each change with `-r`.
- On each change:
    - Run the `nix-build` invocation as above, but without adding a `./result` symlink
    - Take the resulting store path and append `/bin/map` to it
    - Run the executable at the path constructed this way

## Declaring More Options

Rather than setting all script parameters directly, we will to do that through the module system.
This will not just add some safety through type checking, but also allows to build abstractions in order to manage growing complexity and changing requirements.

In this section, you will introduce another option: `generate.requestParams`.

For its type, you should use `listOf <elementType>`, which is a list type where each element must have the specified type.

Instead of `lines`, in this case you will want the type of the list elements to be `str`, a generic string type.

The difference between `str` and `lines` is in their merging behavior:
Module option types not only check for valid values, but also specify how multiple definitions of an option are to be combined into one.
- For `lines`, multiple definitions get merged by concatenation with newlines.
- For `str`, multiple definitions are not allowed. This is not a problem here, since one can't define a list element multiple times.

Make the following additions to your `default.nix` file:

```diff
# default.nix
     generate.script = lib.mkOption {
       type = lib.types.package;
     };
+
+    generate.requestParams = lib.mkOption {
+      type = lib.types.listOf lib.types.str;
+    };
   };

  config = {
    generate.script = pkgs.writeShellApplication {
      name = "map";
      runtimeInputs = with pkgs; [ curl feh ];
      text = ''
        ${./map} size=640x640 scale=2 | feh -
      '';
    };
+
+    generate.requestParams = [
+      "size=640x640"
+      "scale=2"
+    ];
   };
 }
```

## Dependencies Between Options

A given module generally declares one option that produces a result to be used elsewhere, which in this case is `generate.script`.

Options can depend on other options, making it possible to build more useful abstractions.

Here, we want the `generate.script` option to use the values of `generate.requestParams` as arguments to the `map` command.

### Accessing Option Values

To make option values available, the argument of the module accessing them must include the `config` attribute.

Update `default.nix` to add the `config` attribute:

```diff
# default.nix
-{ pkgs, lib, ... }: {
+{ pkgs, lib, config, ... }: {
```

When a module that sets options is evaluated, the resulting values can be accessed by their corresponding attribute names under `config`.

:::{note}
Option values can't be accessed directly from the same module.

The module system evaluates all modules it receives, and any of them can define a particular option's value.
What happens when an option is set by multiple modules is determined by that option's type.

The `config` argument is *not the same* as the `config` attribute where option values are set:
- The `config` argument holds the module system's evaluation result that takes into account all modules passed to `evalModules` and their `imports`.
- The `config` attribute of a module exposes that particular module's option values to the module system for evaluation.
:::

Now make the following changes to `default.nix`:

```diff
# default.nix

   config = {
     generate.script = pkgs.writeShellApplication {
       name = "map";
       runtimeInputs = with pkgs; [ curl feh ];
       text = ''
-        ${./map} size=640x640 scale=2 | feh -
+        builtins.map ${lib.concatStringsSep " "
+              config.generate.requestParams
+             } | feh -
       '';
```

Here, the value of the `config.generate.requestParams` attribute is populated by the module system based on the definitions in the same file.

:::{note}
Lazy evaluation in the Nix language allows the module system to make a value available in the `config` argument passed to the module which defines that value.
:::

`lib.concatStringsSep " "` is then used to join each list element from the value of `config.generate.requestParams` into a single string, with the list elements of `requestParams` separated by a space character.

The result of this represents the list of command line arguments to pass to the `map` script.

## Conditional Definitions

In this section, you will define a new option, `map.zoom`, to control the zoom level of the map.

Since the Google Maps API will infer a zoom level if no corresponding argument is passed, we want to represent that at the module level.
To do that, you will use a new type, `nullOr <type>`, which can take either values of its argument type or `null`.

Add the `map` attribute set with the `zoom` option into the top-level `options` declaration, like so:

```diff
# default.nix
     generate.requestParams = lib.mkOption {
       type = lib.types.listOf lib.types.str;
     };
+
+    map = {
+      zoom = lib.mkOption {
+        type = lib.types.nullOr lib.types.int;
+      };
+    };
   };
```

To make use of this, use the `mkIf <condition> <definition>` function, which only adds the definition if the condition evaluates to `true`.
Make the following additions to the `generate.requestParams` list in the `config` block:

```diff
# default.nix
     generate.requestParams = [
       "size=640x640"
       "scale=2"
+      (lib.mkIf (config.map.zoom != null)
+        "zoom=${toString config.map.zoom}")
     ];
   };
```

This will will only add a `zoom` parameter to the script call if the value is non-null.

## Default values

Let's say that in our application we want to have a different default behavior that sets the the zoom level to `2`, such that automatic zoom has to be enabled explicitly.

This can be done with the `default` argument to [`mkOption`](https://github.com/NixOS/nixpkgs/blob/master/lib/options.nix).
Its value will be used if the value of the option declaring it is otherwise specified.

Add the corresponding line:

```diff
# default.nix
     map = {
       zoom = lib.mkOption {
         type = lib.types.nullOr lib.types.int;
+        default = 2;
       };
     };
   };
```

## Centering the Map

You have now declared options controlling the map dimensions and zoom level, but have not provided a way to specify where the map should be centered.

Add the `center` option now, possibly with your own location as default value:

```diff
# default.nix
         type = lib.types.nullOr lib.types.int;
         default = 2;
       };
+
+      center = lib.mkOption {
+        type = lib.types.nullOr lib.types.str;
+        default = "switzerland";
+      };
     };
   };
```

To implement this behavior, you will use the {download}`geocode <files/geocode>` utility, which turns location names into coordinates.
There are multiple ways of making a new package accessible, but as an exercise, you will add it as an option in the module system.

First, add a new option to accommodate the package:


```diff
# default.nix
   options = {
     generate.script = lib.mkOption {
       type = lib.types.package;
     };
+
+    helpers.geocode = lib.mkOption {
+      type = lib.types.package;
+    };
```

Then define the value for that option where you make the raw script reproducible by wrapping a call to it in `writeShellApplication`:

```diff
# default.nix
   config = {
+    helpers.geocode = pkgs.writeShellApplication {
+      name = "geocode";
+      runtimeInputs = with pkgs; [ curl jq ];
+      text = "exec ${./geocode}";
+    };
+
     generate.script = pkgs.writeShellApplication {
       name = "map";
       runtimeInputs = with pkgs; [ curl feh ];
```

Add another `mkIf` call to the list of `requestParams` now where you access the wrapped package through `config.helpers.geocode`, and run the executable `/bin/geocode` inside:

```diff
# default.nix
       "scale=2"
       (lib.mkIf (config.map.zoom != null)
         "zoom=${toString config.map.zoom}")
+      (lib.mkIf (config.map.center != null)
+        "center=\"$(${config.helpers.geocode}/bin/geocode ${
+          lib.escapeShellArg config.map.center
+        })\"")
     ];
   };
```

This time, you've used `escapeShellArg` to pass the `config.map.center` value as a command-line argument to `geocode`, string interpolating the result back into the `requestParams` string which sets the `center` value.

Wrapping shell command execution in Nix modules is a helpful technique for controlling system changes, as it uses the more ergonomic attributes and values interface rather than dealing with the peculiarities of escaping manually.

## Splitting Modules

The [module schema](https://nixos.org/manual/nixos/stable/#sec-writing-modules) includes the `imports` attribute, which allows incorporating further modules, for example to split a large configuration into multiple files.

In particular, this allows you to separate option declarations from where they are used in your configuration.

Create a new module, `marker.nix`, where you can declare options for defining location pins and other markers on the map:

```diff
# marker.nix
{ lib, config, ... }: {

}
```

Reference this new file in `default.nix` using the `imports` attribute:

```diff
# default.nix
 { pkgs, lib, config ... }: {

+  imports = [
+    ./marker.nix
+  ];
+
```

## The `submodule` Type

We want to set multiple markers on the map.
A marker is a complex type with multiple fields.

This is wher one of the most useful types included in the module system's type system comes into play: `submodule`.
This type allows you to define nested modules with their own options.

Here, you will define a new `map.markers` option whose type is a list of submodules, each with a nested `location` type, allowing you to define a list of markers on the map.

Each assignment of markers will be type-checked during evaluation of the top-level `config`.

Make the following changes to `marker.nix`:

```diff
# marker.nix
-{ pkgs, lib, config, ... }: {
+{ pkgs, lib, config, ... }:
+let
+  markerType = lib.types.submodule {
+    options = {
+      location = lib.mkOption {
+        type = lib.types.nullOr lib.types.str;
+        default = null;
+      };
+    };
+  };
+in {
+
+  options = {
+    map.markers = lib.mkOption {
+      type = lib.types.listOf markerType;
+    };
+  };
```

## Setting Option Values Within Other Modules

Because of the way the module system composes option definitions, you can freely assign values to options defined in other modules.

In this case, you will use the `map.markers` option to produce and add new elements to the `requestParams` list, making your declared markers appear on the returned map – but from the module declared in `marker.nix`.

To implement this behavior, add the following `config` block to `marker.nix`:

```diff
# marker.nix
+  config = {
+
+    map.markers = [
+      { location = "new york"; }
+    ];
+
+    generate.requestParams = let
+      paramForMarker = marker:
+        let
+          attributes =
+            [
+              "$(geocode ${
+                lib.escapeShellArg marker.location
+              })"
+            ];
+        in "markers=${
+          lib.concatStringsSep "\\|" attributes
+        }";
+    in builtins.map paramForMarker config.map.markers;
```

:::{warning}
To avoid confusion with the `map` option setting and the evaluated `config.map` configuration value, here we use the `map` function explicitly as `builtins.map`.
:::


Here, you again used `escapeShellArg` and string interpolation to generate a Nix string, this time producing a pipe-separated list of geocoded location attributes.

The `generate.requestParams` value was also set to the resulting list of strings, which gets appended to the `generate.requestParams` list defined in `default.nix`, thanks to the default merging behavior of the `list` type.

## Dealing with multiple markers

When defining multiple markers, determining an appropriate center or zoom level for the map may be challenging; it's easier to let the API do this for you.

To achieve this, make the following additions to `marker.nix`, above the `generate.requestParams` declaration:

```diff
# marker.nix
+    map.center = lib.mkIf
+      (lib.length config.map.markers >= 1)
+      null;
+
+    map.zoom = lib.mkIf
+      (lib.length config.map.markers >= 2)
+      null;
+
     generate.requestParams = let
       paramForMarker = marker:
         let
```

In this case, the default behavior of the Google Maps API when not passed a center or zoom level is to pick the geometric center of all the given markers, and to set a zoom level appropriate for viewing all markers at once.

## Nested Submodules

Next, we want to allow multiple named users to define a list of markers each.

For that you'll add a `users` option with type `lib.types.attrsOf <subtype>`, which will allow you to define `users` as an attribute set, whose values have type `<subtype>`.

Here, that subtype will be another submodule which allows declaring a departure marker, suitable for querying the API for the recommended route for a trip.

This will again make use of the `markerType` submodule, giving a nested structure of submodules.

To propagate marker definitions from `users` to the `map.markers` option, make the following changes.

In the `let` block:

```diff
# marker.nix
+  userType = lib.types.submodule {
+    options = {
+      departure = lib.mkOption {
+        type = markerType;
+        default = {};
+      };
+    };
+  };
+
 in {
```

This defines a submodule type for a user, with a `departure` option of type `markerType`.

In the `options` block, above `map.markers`:

```diff
# marker.nix
+    users = lib.mkOption {
+      type = lib.types.attrsOf userType;
+    };
```

That allows adding a `users` attribute set to `config` in any submodule that imports `marker.nix`, where each attribute will be of type `userType` as declared in the previous step.

In the `config` block, above `map.center`:

```diff
# marker.nix
   config = {

-    map.markers = [
-      { location = "new york"; }
-    ];
+    map.markers = lib.filter
+      (marker: marker.location != null)
+      (lib.concatMap (user: [
+        user.departure
+      ]) (lib.attrValues config.users));

     map.center = lib.mkIf
       (lib.length config.map.markers >= 1)
```

This takes all the `departure` markers from all users in the `config` argument, and adds them to `map.markers` if their `location` attribute is not `null`.

The `config.users` attribute set is passed to `attrValues`, which returns a list of values of each of the attributes in the set (here, the set of `config.users` you've defined), sorted alphabetically (this how attribute names are stored in the Nix language).

Back in `default.nix`, the resulting `map.markers` option value is still accessed by `generate.requestParams`, which in turn is used to generate arguments to the script that ultimately calls the Google Maps API.

Defining the options in this way allows you to set multiple `users.<name>.departure.location` values and generate a map with the appropriate zoom and center, with pins corresponding to the set of `departure.location` values for *all* `users`.

In the 2021 Summer of Nix, this formed the basis of an interactive multi-person map demo.

## Labeling Markers

Now that the map can be rendered with multiple markers, it's time to add some style customizations.

To tell the markers apart, add another option to the `markerType` submodule, to allow labeling each marker pin.

The API documentation states that [these labels must be either an uppercase letter or a number](https://developers.google.com/maps/documentation/maps-static/start#MarkerStyles).

You can implement this with the `strMatching "<regex>"` type, where `<regex>` is a regular expression that will accept any matching values, in this case an uppercase letter or number.

In the `let` block:

```diff
# marker.nix
         type = lib.types.nullOr lib.types.str;
         default = null;
       };
+
+      style.label = lib.mkOption {
+        type = lib.types.nullOr
+          (lib.types.strMatching "[A-Z0-9]");
+        default = null;
+      };
     };
   };
```

Again, `types.nullOr` allows for `null` values, and the default has been set to `null`.

In the `paramForMarker` function:

```diff
# marker.nix
       paramForMarker = marker:
         let
           attributes =
-            [
+            lib.optional
+              (marker.style.label != null)
+              "label:${marker.style.label}"
+            ++ [
               "$(geocode ${
                 lib.escapeShellArg marker.location
               })"
```

Here, the label for each `marker` is only propagated to the CLI parameters if `marker.style.label` is set.

## Defining a Default Label

Right now, if a label is not explicitly set, none will show up.
But since every `users` attribute has a name, we could use that as an automatic value instead.

This `firstUpperAlnum` function allows you to retrieve the first character of the username, with the correct type for passing to `departure.style.label`:

```diff
# marker.nix
{ lib, config, ... }:
 let
+  # Returns the uppercased first letter
+  # or number of a string
+  firstUpperAlnum = str:
+    lib.mapNullable lib.head
+    (builtins.match "[^A-Z0-9]*([A-Z0-9]).*"
+    (lib.toUpper str));

   markerType = lib.types.submodule {
     options = {
```

By transforming the argument to `lib.types.submodule` into a function, you can access arguments within it.

One special argument automatically available to submodules is `name`, which when used in `attrsOf`, gives you the name of the attribute the submodule is defined under:

```diff
# marker.nix
-  userType = lib.types.submodule {
+  userType = lib.types.submodule ({ name, ... }: {
     options = {
       departure = lib.mkOption {
         type = markerType;
         default = {};
       };
     };
-  };
```

In this case, you don't easily have access to the name from the marker submodules `label` option, where you otherwise could set a `default` value.

Instead you can use the `config` section of the `user` submodule to set a default, like so:

```diff
# marker.nix
+
+    config = {
+      departure.style.label = lib.mkDefault
+        (firstUpperAlnum name);
+    };
+  });

 in {

```

:::{note}
Module options have a *priority*, represented as an integer, which determines the precedence for setting the option to a particular value.
When merging values, the priority with lowest numeric value wins.

The `lib.mkDefault` modifier sets the priority of its argument value to 1000, the lowest precedence.

This ensures that other values set for the same option will prevail.
:::

## Marker Styling: Color

For better visual contrast, it would be helpful to have a way to change the *color* of a marker.

Here you will use two new type-functions for this:
- `either <this> <that>`, which takes two types as arguments, and allows either of them
- `enum [ <allowed values> ]`, which takes a list of allowed values, and allows any of them

In the `let` block, add the following `colorType` option, which can hold strings containing either some given color names or an RGB value add the new compound type:

```diff
# marker.nix
     ...
     (builtins.match "[^A-Z0-9]*([A-Z0-9]).*"
     (lib.toUpper str));

+  # Either a color name or `0xRRGGBB`
+  colorType = lib.types.either
+    (lib.types.strMatching "0x[0-9A-F]{6}")
+    (lib.types.enum [
+      "black" "brown" "green" "purple" "yellow"
+      "blue" "gray" "orange" "red" "white" ]);
+
   markerType = lib.types.submodule {
     options = {
       location = lib.mkOption {
```

This allows either strings that matche a 24-bit hexadecimal number or are equal to one of the specified color names.

At the bottom of the `let` block, add the `style.color` option and specify a default value:

```diff
# marker.nix
           (lib.types.strMatching "[A-Z0-9]");
         default = null;
       };
+
+      style.color = lib.mkOption {
+        type = colorType;
+        default = "red";
+      };
     };
   };
```

Now add an entry to the `paramForMarker` list which makes use of the new option:

```diff
# marker.nix
               (marker.style.label != null)
               "label:${marker.style.label}"
             ++ [
+              "color:${marker.style.color}"
               "$(geocode ${
                 lib.escapeShellArg marker.location
               })"
```

## Marker Styling: Size

In case you set many different markers, it would be helpful to have the ability to change their size individually.

Add a new `style.size` option to `marker.nix`, allowing you to choose from the set of pre-defined sizes:

```diff
# marker.nix
         type = colorType;
         default = "red";
       };
+
+      style.size = lib.mkOption {
+        type = lib.types.enum
+          [ "tiny" "small" "medium" "large" ];
+        default = "medium";
+      };
     };
   };
```

Now add a mapping for the size parameter in `paramForMarker`, which selects an appropriate string to pass to the API:

```diff
# marker.nix
     generate.requestParams = let
       paramForMarker = marker:
         let
+          size = {
+            tiny = "tiny";
+            small = "small";
+            medium = "mid";
+            large = null;
+          }.${marker.style.size};
+
```

Finally, add another `lib.optional` call to the `attributes` string, making use of the selected size:

```
# marker.nix
           attributes =
             lib.optional
               (marker.style.label != null)
               "label:${marker.style.label}"
+            ++ lib.optional
+              (size != null)
+              "size:${size}"
             ++ [
               "color:${marker.style.color}"
               "$(geocode ${
```

## The `pathType` Submodule

So far, you've created an option for declaring a *destination* marker, as well as several options for configuring the marker's visual representation.

Now we want to compute and display a route from the user's location to some destination.

The new option defined in the next section will allow you to set an *arrival* marker, which together with a destination allows you to draw *paths* on the map using the new module defined below.

To start, create a new `path.nix` file with the following contents:

```diff
# path.nix
{ lib, config, ... }:
let
  pathType = lib.types.submodule {
    options = {
      locations = lib.mkOption {
        type = lib.types.listOf lib.types.str;
      };
    };
  };
in {
  options = {
    map.paths = lib.mkOption {
      type = lib.types.listOf pathType;
    };
  };

  config = {
    generate.requestParams = let
      attrForLocation = loc:
        "$(geocode ${lib.escapeShellArg loc})";
      paramForPath = path:
        let
          attributes =
            builtins.map attrForLocation path.locations;
        in "path=${
            lib.concatStringsSep "\\|" attributes
          }";
      in builtins.map paramForPath config.map.paths;
  };
}
```

The `path.nix` module defines an option for declaring a list of paths on our `map`, where each path is a list of strings for geographic locations.


In the `config` attribute we augment the API call by setting the `generate.requestParams` option value with the coordinates transformed appropriately, which will be concatenated with request paremeters set elsewhere.

Now import this new `path.nix` module from your `marker.nix` module:

```diff
# marker.nix
 in {

+  imports = [
+    ./path.nix
+  ];
+
   options = {

     users = lib.mkOption {
```

## The Arrival Marker

Copy the `departure` option declaration to a new `arrival` option in `marker.nix`, to complete the initial path implementation:

```diff
# marker.nix
         type = markerType;
         default = {};
       };
+
+      arrival = lib.mkOption {
+        type = markerType;
+        default = {};
+      };
     };
```

Next, add an `arrival.style.label` attribute to the `config` block, mirroring the `departure.style.label`:

```diff
# marker.nix
     config = {
       departure.style.label = lib.mkDefault
         (firstUpperAlnum name);
+      arrival.style.label = lib.mkDefault
+        (firstUpperAlnum name);
     };
   });
```

Finally, update the return list in the function passed to `concatMap` in `map.markers` to also include the `arrival` marker for each user:

```diff
# marker.nix
     map.markers = lib.filter
       (marker: marker.location != null)
       (lib.concatMap (user: [
-        user.departure
+        user.departure user.arrival
       ]) (lib.attrValues config.users));

     map.center = lib.mkIf
```

Now you have the basesis to define paths on the map, connecting pairs of departure and arrival points.

## Connecting Markers by Paths

In the path module, define a path connecting every user's departure and arrival locations:

```diff
# path.nix
   config = {
+
+    map.paths = builtins.map (user: {
+      locations = [
+        user.departure.location
+        user.arrival.location
+      ];
+    }) (lib.filter (user:
+      user.departure.location != null
+      && user.arrival.location != null
+    ) (lib.attrValues config.users));
+
     generate.requestParams = let
       attrForLocation = loc:
         "$(geocode ${lib.escapeShellArg loc})";
```

The new `map.paths` attribute contains a list of all valid paths defined for all users.

A path is valid only if the `departure` and `arrival` attributes are set for that user.

## Path Styling: Weight

Your users have spoken, and they demand the ability to customize the styles of their paths with a `weight` option.

As before, you'll now declare a new submodule for the path style.

While you could also directly declare the `style.weight` option, in this case you should use the submodule to be able reuse the path style type later.

Add the `pathStyleType` submodule option to the `let` block in `path.nix`:
```diff
# path.nix
 { lib, config, ... }:
 let
+
+  pathStyleType = lib.types.submodule {
+    options = {
+      weight = lib.mkOption {
+        type = lib.types.ints.between 1 20;
+        default = 5;
+      };
+    };
+  };
+
   pathType = lib.types.submodule {
```

:::{note}
The `ints.between <lower> <upper>` type allows integers in the given (inclusive) range.
:::

The path weight will default to 5, but can be set to any integer value in the 1 to 20 range, with higher weights producing thicker paths on the map.

Now add a `style` option to the `options` set further down the file:

```diff
# path.nix
     options = {
       locations = lib.mkOption {
         type = lib.types.listOf lib.types.str;
       };
+
+      style = lib.mkOption {
+        type = pathStyleType;
+        default = {};
+      };
     };

   };
```

Finally, update the `attributes` list in `paramForPath`:

```diff
# path.nix
       paramForPath = path:
         let
           attributes =
-            builtins.map attrForLocation path.locations;
+            [
+              "weight:${toString path.style.weight}"
+            ]
+            ++ builtins.map attrForLocation path.locations;
         in "path=${
             lib.concatStringsSep "\\|" attributes
           }";
```

## The `pathStyle` Submodule

Users still can't actually customize the path style yet.
Introduce a new `pathStyle` option for each user.

The module system allows you to declare values for an option multiple times, and if the types permit doing so, takes care of merging each declaration's values together.

This makes it possible to have a definition for the `user` option in the `marker.nix` module, as well as a `user` definition in `path.nix`:

```diff
# path.nix
 in {
   options = {
+
+    users = lib.mkOption {
+      type = lib.types.attrsOf (lib.types.submodule {
+        options.pathStyle = lib.mkOption {
+          type = pathStyleType;
+          default = {};
+        };
+      });
+    };
+
     map.paths = lib.mkOption {
       type = lib.types.listOf pathType;
     };
```

Then add a line using the `user.pathStyle` option in `map.paths` where each user's paths are processed:

```diff
# path.nix
         user.departure.location
         user.arrival.location
       ];
+      style = user.pathStyle;
     }) (lib.filter (user:
       user.departure.location != null
       && user.arrival.location != null
```

## Path Styling: Color

As with markers, paths should have customizable colors.

You can accomplish this using types you've already encountered by now.

Add a new `colorType` block to `path.nix`, specifying the allowed color names and RGB/RGBA hexadecimal values:

```diff
# path.nix
 { lib, config, ... }:
 let

+  # Either a color name, `0xRRGGBB` or `0xRRGGBBAA`
+  colorType = lib.types.either
+    (lib.types.strMatching "0x[0-9A-F]{6}[0-9A-F]{2}?")
+    (lib.types.enum [
+      "black" "brown" "green" "purple" "yellow"
+      "blue" "gray" "orange" "red" "white"
+    ]);
+
   pathStyleType = lib.types.submodule {
```

Under the `weight` option, add a new `color` option to use the new `colorType` value:

```diff
# path.nix
         type = lib.types.ints.between 1 20;
         default = 5;
       };
+
+      color = lib.mkOption {
+        type = colorType;
+        default = "blue";
+      };
     };
   };
```

Finally, add a line using the `color` option to the `attributes` list:

```diff
# path.nix
           attributes =
             [
               "weight:${toString path.style.weight}"
+              "color:${path.style.color}"
             ]
             ++ map attrForLocation path.locations;
         in "path=${
```

## Further Styling

Now that you've got this far, to further improve the aesthetics of the rendered map, add another style option allowing paths to be drawn as *geodesics*, the shortest "as the crow flies" distance between two points on Earth.

Since this feature can be turned on or off, you can do this using the `bool` type, which can be `true` or `false`.

Make the following changes to `path.nix` now:

```diff
# path.nix
         type = colorType;
         default = "blue";
       };
+
+      geodesic = lib.mkOption {
+        type = lib.types.bool;
+        default = false;
+      };
     };
   };
```

Make sure to also add a line to use that value in `attributes` list, so the option value is included in the API call:

```diff
# path.nix
             [
               "weight:${toString path.style.weight}"
               "color:${path.style.color}"
+              "geodesic:${lib.boolToString path.style.geodesic}"
             ]
             ++ map attrForLocation path.locations;
         in "path=${
```

## Wrapping Up

In this tutorial, you've learned how to write custom Nix modules to bring external services under declarative control, with the help of several new utility functions from the Nixpkgs `lib`.

You defined several modules in multiple files, each with separate submodules making use of the module system's type checking.

These modules exposed features of the external API in a declarative way.

You can now conquer the world with Nix.
