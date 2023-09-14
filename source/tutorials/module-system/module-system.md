# The Module System
Much of the power in Nixpkgs comes from the module system, which provides mechanisms for automatically merging attribute sets, making it easy to compose configurations in a type-safe way.

In this tutorial, you'll write your first modules to interact with the Google Maps API, declaring options which represent map geometry, location pins, and more.

You'll learn what a module is and how to define one, what options are and how to declare them, how to express dependencies between modules, and a practical way to use Nix to wrap external APIs.

Be prepared to see some Nix errors: during the tutorial, you will first write some *incorrect* configurations, creating opportunities to discuss the resulting error messages and how to resolve them, particularly when discussing type checking.

:::{note}
This tutorial follows [@infinisil's presentation](https://infinisil.com/modules.mp4) of the [Summer of Nix Modules](https://github.com/tweag/summer-of-nix-modules), during the 2021 Summer of Nix.
:::

## Empty module

The simplest module is just an empty attribute set, which doesn't do anything!

Write the following into a file called `default.nix`:

```nix
# default.nix
{

}
```

## Module Arguments

In order to make a module actually useful, you will need to write it as a *function*, which takes an attribute set as an argument.

Do this by adding the following new line to `default.nix`:

```diff
# default.nix
+ { lib, ... }:
{

}
```

The addition of this line turns the expression in `default.nix` into a function which takes *at least* one argument, called `lib`, and may accept other arguments (expressed by the ellipsis `...`).

Matching on the `lib` argument will make `nixpkgs` library functions available within the function body.

:::{note}
The ellipsis `...` is necessary because arbitrary arguments can be passed to modules.
:::

## Declaring Options

One of the reasons for writing modules is to declare names which can be assigned values and used in other computations elsewhere.

For your new module to become useful, you will need to add some *options*, which define these named-values.

Options are declared by defining an attribute under the top-level  `options` attribute, using `lib.mkOption`.

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

While many attributes for customizing options are available, the most important one is `type`, which specifies which values are valid for an option, and how or whether multiple values should be merged together.

There are several other types available under [`lib.types`](https://github.com/NixOS/nixpkgs/blob/master/lib/types.nix) in the nixpkgs library.

You have just declared `generate.script` with the `lines` type, which specifies that the only valid values are strings, and that multiple strings should be joined with newlines.

Write a new file, `eval.nix`, which you will use to evaluate `default.nix`:

```nix
# eval.nix
(import <nixpkgs/lib>).evalModules {
  modules = [
    ./default.nix
  ];
}
```

Now execute the following command:

```bash
nix-instantiate --eval eval.nix -A config.generate.script
```

You will see an error message indicating that the `generate.script` option is used but not defined; you will need to assign a value to the option before using it.

## Type Checking
As previously mentioned, the `lines` type only permits string values.

:::{warning}
In this section, you will make your first type error. Be prepared!
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
+      map size=640x640 scale=2 | icat
+    '';
   };
```

TODO: Create derivations to get these commands

## Declaring More Options
In this section, you will introduce another option: `generate.requestParams`.

For its type, you should use `listOf <nestedType>`, which is a generic list type where each element must have the given nested type.

Instead of `lines`, in this case you will want the nested type to be `str`, a generic string type.

The difference between `str` and `lines` is in their merging behavior:
- For `lines`, multiple definitions get merged by concatenation with newlines.
- For `str`, multiple definitions are not allowed. This is mostly irrelevant here however, since it is not really possible to define a list element multiple times.

Make the following additions to your `default.nix` file now:
```diff
# default.nix
     generate.script = lib.mkOption {
       type = lib.types.lines;
     };
+
+    generate.requestParams = lib.mkOption {
+      type = lib.types.listOf lib.types.str;
+    };
   };

   config = {
     generate.script = ''
       map size=640x640 scale=2 | icat
     '';
+
+    generate.requestParams = [
+      "size=640x640"
+      "scale=2"
+    ];
   };

 }
```

## Dependencies Between Options

A given module generally only declares a single option that is meant to be evaluated.

This option generates the final result to be used elsewhere, which in this case is `generate.script`.

Options have the ability to depend on other options, making it possible to build more useful abstractions.

Here, the plan is for the `generate.script` option to use the values of `generate.requestParams` as arguments to the `map` command.

### Accessing Option Values
To make a declared option available, the argument attribute set of the module declaring it must include the `config` attribute.

Update `default.nix` to add the `config` attribute:
```diff
# default.nix
-{ lib, ... }: {
+{ lib, config, ... }: {
```

When a module declaring an option is evaluated, values of the resulting option can be accessed by using attribute names to access the corresponding values.

Now make the following changes to `default.nix`:

```diff
# default.nix
   config = {
     generate.script = ''
-      map size=640x640 scale=2 | icat
+      map ${lib.concatStringsSep " "
+            config.generate.requestParams
+           } | icat
     '';
```

Here, the value of the `config.generate.requestParams` attribute is substituted at its call site.

`lib.concatStringsSep " "` is then used to join each list element from the value of `config.generate.requestParams` into a single string, with the list elements of `requestParams` separated by a space character.

The result of this represents the list of command line arguments to pass to `map`.

## Conditional Definitions and Default Values

In this section, you will define a new option, `map.zoom`, to control the zoom level of the map.

You will use a new type, `nullOr <type>`, which can take as values either the values of its argument type or `null`.

In this case, a `null` value will use the API's default behavior of inferring the zoom level.

Here, you will also use `default` from `mkOption`](https://github.com/NixOS/nixpkgs/blob/master/lib/options.nix) to declare your first *default* value, which will be used if the option declaring it is not enabled.

You will use this option to define another element in `generate.requestParams`, which will only be added if its value is non-null.

To do this, you can use the `mkIf <condition> <definition>` function, which only adds the definition if the condition holds.

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
+        default = 2;
+      };
+    };
   };
 ```

Now make the following additions to the `generate.requestParams` list in the `config` block:

```diff
# default.nix
   config = {
     ...
     generate.requestParams = [
       "size=640x640"
       "scale=2"
+      (lib.mkIf (config.map.zoom != null)
+        "zoom=${toString config.map.zoom}")
     ];
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

To implement this behavior, you will use the `geocode` utility, which turns location names into coordinates.

Add another `mkIf` call to the list of `requestParams` now:

```diff
# default.nix
       "scale=2"
       (lib.mkIf (config.map.zoom != null)
         "zoom=${toString config.map.zoom}")
+      (lib.mkIf (config.map.center != null)
+        "center=\"$(geocode ${
+          lib.escapeShellArg config.map.center
+        })\"")
     ];
   };
```

This time, you've used `escapeShellArg` to pass the `config.map.center` value as a command-line argument to `geocode`, interpolating the result back into the `requestParams` string which sets the `center` value.

Wrapping shell command execution in Nix modules is a powerful technique for controlling system changes using the ergnomic attributes and values interface.

## Splitting Modules

The module schema includes the `imports` attribute, which allows you to define further modules to import, enabling a *modular* approach where your configuration may be split into multiple files.

In particular, this allows you to separate option declarations from their call-sites in your configuration.

You should now create a new module, `marker.nix`, where you can declare options for defining location pins and other markers on the map.
```diff
# marker.nix
+{ lib, config, ... }: {
+
+}
```

Reference this new file in `default.nix` using the `imports` attribute:
```diff
# default.nix
 { lib, config, ... }: {

+  imports = [
+    ./marker.nix
+  ];
+
```

## The `submodule` Type

One of the most useful types included in the module system's type system is `submodule`.

This type allows you to define nested modules with their own options.

Every value of such a type is then interpreted (by default) as a `config` assignment of the nested module evaluation.

Here, you will define a new `map.markers` option whose type is a list of submodules, each with a nested `location` type, allowing you to define a list of markers on the map.

Each assignment of markers will be type-checked during evaluation of the top-level `config`.

Make the following changes to `marker.nix` now:
```diff
# marker.nix
-{ lib, config, ... }: {
+{ lib, config, ... }:
+let
+
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
 }
```

## Setting Option Values Within Other Modules

Because of the way the module system composes option definitions, you can also freely assign values to options defined in other modules.

In this case, you will use the `map.markers` option to derive and add new `requestParams`, making your declared markers appear on the returned map.

To implement this behavior, add the following `config` block to `marker.nix`:
```diff
# marker.nix
   ...
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
+    in map paramForMarker config.map.markers;
+
+  };
 }
```

Here, you again used `escapeShellArg` and string interpolation to generate a Nix string, this time producing a pipe-separated list of geocoded location attributes.

The `generate.requestParams` value was also set to the resulting list of strings, which gets appended to the `generate.requestParams` list defined in `default.nix`, thanks to the default behavior of the `list`-type module.

## Multiple Markers

In case you define multiple markers, determining an appropriate center or zoom level for the map may be challenging; it's easier to let the API do this for you.

To do this, make the following additions to `marker.nix`, above the `generate.requestParams` declaration:
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

In this case, the default behavior of the Maps API when not passed a center or zoom level is to pick the geometric center of all the given markers, and to set a zoom level appropriate for viewing all markers at once.

## Nested Submodules

It's time to introduce the `users` option with the `lib.types.attrsOf <subtype>` type, which will allow you to define `users` as an attribute set with arbitrary keys, each value of which has type `<subtype>`.

Here, that subtype will be another submodule which allows declaring a departure marker, suitable for querying the API for the recommended route for a trip.

This will also make use of the `markerType` submodule, giving a nested structure of submodules.

To propagate marker definitions from `users`  to the `map.markers` option, make the following changes now:

- In the `let` block:

```diff
# marker.nix
 let
   ...
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

- In the `options` block, above `map.markers`:
```diff
# marker.nix
   options = {
+
+    users = lib.mkOption {
+      type = lib.types.attrsOf userType;
+    };
+
```

- In the `config` block, above `map.center`:
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

The `config.users` attribute set is passed to `attrValues`, which returns a list of values of each of the attributes in the set (here, the set of `config.users` you've defined), sorted alphabetically.

The `departure` values of each of the `users` are then joined into a list, and this list is filtered for non-`null` locations.

The resulting list is stored in `map.markers`.

The resulting `map.markers` option then propagates to the `generate.requestParams` option, which in turn is used to generate arguments to the script which ultimately calls the Maps API.

Defining the options in this way allows you to set multiple `users.<name>.departure.location` values and generate a map with the appropriate zoom and center, with pins corresponding to the set of `departure.location` values for *all* `users`.

In the 2021 Summer of Nix, this formed the basis of an interactive multi-person map demo.

## Labeling Markers

Now that the map can be rendered with multiple markers, it's time to add some style customization.

To tell the markers apart, you should add another option to the `markerType` submodule, to allow labeling each marker pin.

The API [states](https://developers.google.com/maps/documentation/maps-static/start#MarkerStyles) that these labels must be either an uppercase letter or a number.

You can implement this with the `strMatching "<regex>"` type, where `<regex>` is a regular expression used for the matching; this will reject any unacceptable (non-uppercase letter or number) values.

- In the `let` block:
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

- In the `paramForMarker` function:
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

In case you don't want to manually define a label for every marker, you can set a default value.

The easiest value for a default label is the username, which will always also be set.

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

One special argument available to submodules is the `name` argument, which when used in `attrsOf`, gives you the name of the attribute the submodule is defined under.

You can use this function argument to retrieve the `name` attribute for use elsewhere:

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
Module options have a *precedence*, represented as an integer, which determines the priority of setting the option to a particular value.

The `lib.mkDefault` modifier sets the precedence of its argument value to 1000, the lowest priority.

This ensures that other values set for the same option will prevail.
:::


## Marker Styling: Color

For better visual contrast, it would also be helpful to have a way to change the *color* of a marker.

Here you will use two new type-functions for this:
- `either <this> <that>`, which takes two types as arguments, allows either of them
- `enum [ <allowed values> ]`, which takes a list of allowed values

In the `let` block, add the following `colorType` option, which can hold strings containing either some given color names or an RGB value:
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

At the bottom of the `let` block, add the `style.color` option:
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

Now add a line to the `paramForMarker` list which makes use of the new option:
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

In case you set many different markers, it would be helpful to have the ability to change their size individually, further improving visual accessibility.

Add a new `style.size` option to `marker.nix`, allowing you to do so:

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

Now add a handler for the size parameter in `paramForMarker`, which selects an appropriate string to pass to the API:
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

The new option defined in the next section will allow you to set an *arrival* marker, which together with a destination allows you to draw *paths* on the map using the new module defined below.

To start, create a new `path.nix` file with the following contents:

```diff
# path.nix
+{ lib, config, ... }:
+let
+  pathType = lib.types.submodule {
+
+    options = {
+      locations = lib.mkOption {
+        type = lib.types.listOf lib.types.str;
+      };
+    };
+
+  };
+in {
+  options = {
+    map.paths = lib.mkOption {
+      type = lib.types.listOf pathType;
+    };
+  };
+
+  config = {
+    generate.requestParams = let
+      attrForLocation = loc:
+        "$(geocode ${lib.escapeShellArg loc})";
+      paramForPath = path:
+        let
+          attributes =
+            map attrForLocation path.locations;
+        in "path=${
+            lib.concatStringsSep "\\|" attributes
+          }";
+      in map paramForPath config.map.paths;
+  };
+}
```

The `path.nix` module defines an option for declaring paths, augmenting the API call by re-using the `generate.requestParams` option.

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

Now copy the `departure` option declaration to a new `arrival` option in `marker.nix`, to complete the initial path implementation:

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

Finally, update the return list in the function passed to `concatMap` in `map.markers`:
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

You should now be able to define paths on the map, connecting pairs of departure and arrival points.

## Connecting Markers by Paths

In the path module, you can now define a path connecting every user's departure and arrival locations.

```diff
# path.nix
   config = {
+
+    map.paths = map (user: {
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

:::{warning}
Don't confuse the `map` function with the `map` option or the `map` script!
:::

The new `map.paths` attribute contains a list of all valid paths defined for all users.

A path is valid only if the `departure` and `arrival` attributes are set for that user.

## Path Styling: Weight

Your users have spoken, and they demand the ability to customize the styles of their paths with a `weight` option.

As before, you'll now declare a new submodule for the path style.

While you could also directly define the `style.weight` option, in this case, you should use the submodule in a future change to reuse the path style definitions.

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
-            map attrForLocation path.locations;
+            [
+              "weight:${toString path.style.weight}"
+            ]
+            ++ map attrForLocation path.locations;
         in "path=${
             lib.concatStringsSep "\\|" attributes
           }";
```

## The `pathStyle` Submodule

Users still can't actually customize the path style yet, so you should introduce a new `pathStyle` option for each user.

The module system allows you to declare values for an option multiple times, and if the types permit doing so, takes care of merging each declaration's values together.

This makes it possible to have a definition for the `user` option in the `marker.nix` module, as well as a `user` definition in `path.nix`, which you should add now:

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

Then add a line using the `user.pathStyle` option in `map.paths`:
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

You can accomplish this using types you've already seen by now.

Add a new `colorType` block to `path.nix`, specifying the allowed color names and RGB/RGBA values:
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

To further improve the aesthetics of the rendered map, you should add another style option allowing paths to be drawn as *geodesics*, the shortest "as the crow flies" distance between two points on Earth.

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

Make sure to also add a new line using this to the `attributes` list, so the option value is included in the API call:
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
