# Module system introduction

Note: This tutorial was created from https://github.com/tweag/summer-of-nix-modules, as presented by @infinisil at Summer of Nix 2021, presentation can be seen here (might not work in browser, `mpv` should work): https://infinisil.com/modules.mp4

## Empty module

The simplest module you can have is just an empty attribute set, which
as you might expect, doesn't do anything!

```diff
diff --git a/default.nix b/default.nix
new file mode 100644
index 0000000..1797133
--- /dev/null
+++ b/default.nix
@@ -0,0 +1,3 @@
+{
+  
+}
```

## Module arguments: lib

Modules can be just an attribute set. But if you want access to some
arguments you need to change it into a function taking an attribute set
with an ellipsis (that's the "..."). In this case we only match on the
`lib` argument, which gives us access to nixpkgs library functions.

Note that the ellipsis is necessary since arbitrary arguments can be
passed to modules.

```diff
diff --git a/default.nix b/default.nix
index 1797133..f7569bd 100644
--- a/default.nix
+++ b/default.nix
@@ -1,3 +1,3 @@
-{
+{ lib, ... }: {
   
 }
```

## Declaring generate.script option

In order for modules to be useful, we need to have options, so let's
declare one. Options are declared by defining an attribute with
`lib.mkOption` under the `options` attribute. Here we're defining the
option `generate.script`.

While there are many attributes to customize options, the most
important one is `type`, which specifies what values are valid for an
option, and how/whether multiple values should be merged together.

In the nixpkgs library there are a number of types available under
`lib.types`. Here we're using the `lines` type, which specifies that:
- Only strings are valid values
- Multiple strings are joined with newlines

```diff
diff --git a/default.nix b/default.nix
index f7569bd..cb423a9 100644
--- a/default.nix
+++ b/default.nix
@@ -1,3 +1,9 @@
 { lib, ... }: {
+
+  options = {
+    generate.script = lib.mkOption {
+      type = lib.types.lines;
+    };
+  };
   
 }
```

Let's try to evaluate this with this file:

```nix
# eval.nix
(import <nixpkgs/lib>).evalModules {
  modules = [
    ./default.nix
  ];
}
```

Then we run
```bash
nix-instantiate --eval eval.nix -A config.generate.script
```

Trying to evaluate the `generate.script` option however, we get an error
that the option is used but not defined, indicating that we need to
actually give a value to the option.


## Type checking: Assigning integer to generate.script

We can try to assign an integer to our option of type `lines`, but the
module system correctly throws an error saying that our definition
doesn't match the options type.

```diff
diff --git a/default.nix b/default.nix
index cb423a9..0a9162e 100644
--- a/default.nix
+++ b/default.nix
@@ -5,5 +5,9 @@
       type = lib.types.lines;
     };
   };
+
+  config = {
+    generate.script = 42;
+  };
   
 }
```

## Successful evaluation: Assigning a string to generate.script

We can make type checking pass by assigning a string to the option,
giving us our first successful evaluation of the `generate.script`
option.

In this case, we assign a script which calls the Google Maps Static API
to generate a world map, then displaying the result using icat
(image-cat), both of which are helper scripts.

```diff
diff --git a/default.nix b/default.nix
index 0a9162e..24f9c34 100644
--- a/default.nix
+++ b/default.nix
@@ -7,7 +7,9 @@
   };
 
   config = {
-    generate.script = 42;
+    generate.script = ''
+      map size=640x640 scale=2 | icat
+    '';
   };
   
 }
```

TODO: Create derivations to get these commands

## A new list option: Declaring generate.requestParams

Let's introduce another option, generate.requestParams. For its type,
we'll use `listOf <nestedType>`, which is a generic list type where each
element has to match the given nested type. In our case we want `str` to
be the nested type, which is a generic string type.

Note that the difference between `str` and `lines` is in their merging
behavior:
- For `lines`, multiple definitions get merged by concatenation with
  newlines
- For `str`, multiple definitions are not allowed. Which in this case is
  mostly irrelevant however, since we can't really define a list element
  multiple times.

```diff
diff --git a/default.nix b/default.nix
index 24f9c34..fd5027a 100644
--- a/default.nix
+++ b/default.nix
@@ -4,12 +4,21 @@
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

## Dependencies between options: Using generate.requestParams

A collection of modules generally only has a single option that is meant
to be evaluated. That's the option that generates the final result we're
interested in, which in our case is `generate.script`.

In order to build up abstractions on that, we have the ability for
options to depend on other options. In this case we want the
`generate.script` option to use the values of `generate.requestParams`.
We can access the values of options by adding the `config` argument to
the argument list at the top and using e.g.
`config.generate.requestParams` to access that options value.

We're then using `lib.concatStringsSep " "` to join each list element
of the option together into an argument list.

```diff
diff --git a/default.nix b/default.nix
index fd5027a..050a98e 100644
--- a/default.nix
+++ b/default.nix
@@ -1,4 +1,4 @@
-{ lib, ... }: {
+{ lib, config, ... }: {
 
   options = {
     generate.script = lib.mkOption {
@@ -12,7 +12,9 @@
 
   config = {
     generate.script = ''
-      map size=640x640 scale=2 | icat
+      map ${lib.concatStringsSep " "
+            config.generate.requestParams
+           } | icat
     '';
 
     generate.requestParams = [
```

## Conditional definitions: Introducing map.zoom option

We now introduce the new option `map.zoom` in order to control the zoom
level of the map. We'll use a new type for it, `nullOr <type>`, which
accepts the value `null`, but also values of its argument type. We're
using `null` here to mean an inferred zoom level.

For this option, we'll set a default value which should be used if it's
not defined otherwise, which we can do using `mkOption`'s `default`
argument.

Now we want to use this option to define another element in
`generate.requestParams`, but we only want to add this element if its
value is non-null. We can do this using the `mkIf <condition>
<definition>` function, which only adds a definition if the condition
holds.

```diff
diff --git a/default.nix b/default.nix
index 050a98e..6b6e1e1 100644
--- a/default.nix
+++ b/default.nix
@@ -8,6 +8,13 @@
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
 
   config = {
@@ -20,6 +27,8 @@
     generate.requestParams = [
       "size=640x640"
       "scale=2"
+      (lib.mkIf (config.map.zoom != null)
+        "zoom=${toString config.map.zoom}")
     ];
   };
   
```

## Declaring map.center option

Similarly, let's declare a map.center option, declaring where the map
should be centered.

We'll be using a small utility for geocoding location names, aka turning
them from names into coordinates

```diff
diff --git a/default.nix b/default.nix
index 6b6e1e1..098d135 100644
--- a/default.nix
+++ b/default.nix
@@ -14,6 +14,11 @@
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
 
@@ -29,6 +34,10 @@
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

## Splitting modules: importing marker.nix

The module system allows you to split your config into multiple files
via the `imports` attribute, which can define further modules to import.
This allows us to logically separate options and config for different
parts.

Here we create a new module `marker.nix`, where we will declare options
for defining markers on the map

```diff
diff --git a/default.nix b/default.nix
index 098d135..9d9f29d 100644
--- a/default.nix
+++ b/default.nix
@@ -1,5 +1,9 @@
 { lib, config, ... }: {
 
+  imports = [
+    ./marker.nix
+  ];
+
   options = {
     generate.script = lib.mkOption {
       type = lib.types.lines;
diff --git a/marker.nix b/marker.nix
new file mode 100644
index 0000000..035c28d
--- /dev/null
+++ b/marker.nix
@@ -0,0 +1,3 @@
+{ lib, config, ... }: {
+
+}
```

## Submodule types: Declaring map.markers option

One of the most useful types of the module system is the `submodule`
type. This type allows you to define a nested module system evaluation,
with its own options. Every value of such a type is then interpreted
(by default) as a `config` assignment of the nested module evaluation.

In this case we're defining a `map.markers` option, whose type is a list
of submodules with a nested `location` type, allowing us to define a
list of markers on the map, where each assignment is type checked
according to the submodule.

```diff
diff --git a/marker.nix b/marker.nix
index 035c28d..6a6c686 100644
--- a/marker.nix
+++ b/marker.nix
@@ -1,3 +1,20 @@
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

## Single option namespace: Defining markers in generate.requestParams

Since all modules in `imports` are treated the same, we can also freely
assign an option defined in our initial module. In this case we want to
add some request parameters derived from the `map.markers` option, so
that markers actually show up on the map.

```diff
diff --git a/marker.nix b/marker.nix
index 6a6c686..c2c5da2 100644
--- a/marker.nix
+++ b/marker.nix
@@ -17,4 +17,26 @@ in {
     };
   };
 
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
+
 }
```

## Set map.{center,zoom} for more than {1,2} markers

Let's let the API infer the center if we have more than one marker, and
let's let it infer the zoom as well if there's more than 2.

```diff
diff --git a/marker.nix b/marker.nix
index c2c5da2..b80ddd0 100644
--- a/marker.nix
+++ b/marker.nix
@@ -23,6 +23,14 @@ in {
       { location = "new york"; }
     ];
 
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

## Nested submodules: Introducing users option

We will now introduce the option `users`, where we make use of a very
useful type, `lib.types.attrsOf <subtype>`. This type lets us specify an
attribute set as a value, where the keys can be arbitrary, but each
value has to conform to the given <subtype>.

In this case, we'll use another submodule as the subtype, one that
allows declaring a departure marker, which notably also makes use of our
`markerType` submodule, giving us a nested structure of submodules.

We're now propagating each of the users marker definitions to the
`map.markers` option.

```diff
diff --git a/marker.nix b/marker.nix
index b80ddd0..3c54ad8 100644
--- a/marker.nix
+++ b/marker.nix
@@ -9,9 +9,24 @@ let
       };
     };
   };
+
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
 
   options = {
+
+    users = lib.mkOption {
+      type = lib.types.attrsOf userType;
+    };
+
     map.markers = lib.mkOption {
       type = lib.types.listOf markerType;
     };
@@ -19,9 +34,11 @@ in {
 
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

## Introducing style.label and strMatching type

Let's add an option to customize markers with a label. We can do so by
just adding another option in our markerType submodule. The API states
that this has to be an uppercase letter or a number, which we can
implement with the `strMatching "<regex>"` type.

```diff
diff --git a/marker.nix b/marker.nix
index 3c54ad8..1c9a043 100644
--- a/marker.nix
+++ b/marker.nix
@@ -7,6 +7,12 @@ let
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
 
@@ -52,7 +58,10 @@ in {
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

## Using the attribute name in the submodule to define a default label

Let's set a default label by deriving it from the username. By
transforming the submodule's argument into a function, we can access
arguments within it. One special argument available to submodules is the
`name` argument, which when used in `attrsOf`, gives you the name of the
attribute the submodule is defined under.

In this case, we don't easily have access to the name from the marker
submodules label option (where we could set a `default =`). Instead we
will use the `config` section of the user submodule to set a default. We
can do so using the `lib.mkDefault` modifier, which has lower precedence
than if no modifier were used.

```diff
diff --git a/marker.nix b/marker.nix
index 1c9a043..53860f1 100644
--- a/marker.nix
+++ b/marker.nix
@@ -1,5 +1,11 @@
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
@@ -16,14 +22,19 @@ let
     };
   };
 
-  userType = lib.types.submodule {
+  userType = lib.types.submodule ({ name, ... }: {
     options = {
       departure = lib.mkOption {
         type = markerType;
         default = {};
       };
     };
-  };
+
+    config = {
+      departure.style.label = lib.mkDefault
+        (firstUpperAlnum name);
+    };
+  });
 
 in {
 
```

## Marker colors

Let's allow markers to change their color as well. We'll use some new
type functions for this, namely
- `either <this> <that>`: Takes two types as arguments, allows either of
  them
- `enum [ <allowed values> ]`: Takes a list of allowed values

```diff
diff --git a/marker.nix b/marker.nix
index 53860f1..df0d08b 100644
--- a/marker.nix
+++ b/marker.nix
@@ -7,6 +7,13 @@ let
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
@@ -19,6 +26,11 @@ let
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
 
@@ -73,6 +85,7 @@ in {
               (marker.style.label != null)
               "label:${marker.style.label}"
             ++ [
+              "color:${marker.style.color}"
               "$(geocode ${
                 lib.escapeShellArg marker.location
               })"
```

## Marker size

Let's also allow changing of marker sizes.

```diff
diff --git a/marker.nix b/marker.nix
index df0d08b..2c0c1a8 100644
--- a/marker.nix
+++ b/marker.nix
@@ -31,6 +31,12 @@ let
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
 
@@ -80,10 +86,20 @@ in {
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

## Initial path module

Let's introduce a new module for declaring paths on the map. We'll
import a new `path.nix` module from our `marker.nix` module.

In the path module we'll define an option for declaring paths, and will
use the same `generate.requestParams` to influence the API call to
include our defined paths

```diff
diff --git a/marker.nix b/marker.nix
index 2c0c1a8..ffb8185 100644
--- a/marker.nix
+++ b/marker.nix
@@ -56,6 +56,10 @@ let
 
 in {
 
+  imports = [
+    ./path.nix
+  ];
+
   options = {
 
     users = lib.mkOption {
diff --git a/path.nix b/path.nix
new file mode 100644
index 0000000..554a88b
--- /dev/null
+++ b/path.nix
@@ -0,0 +1,32 @@
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

## Arrival marker

Now in order for users to be able to draw a path in their definitions,
we need to allow them to specify another marker. We will copy the
`departure` option declaration to a new `arrival` option for that.

```diff
diff --git a/marker.nix b/marker.nix
index ffb8185..940b8f8 100644
--- a/marker.nix
+++ b/marker.nix
@@ -46,11 +46,18 @@ let
         type = markerType;
         default = {};
       };
+
+      arrival = lib.mkOption {
+        type = markerType;
+        default = {};
+      };
     };
 
     config = {
       departure.style.label = lib.mkDefault
         (firstUpperAlnum name);
+      arrival.style.label = lib.mkDefault
+        (firstUpperAlnum name);
     };
   });
 
@@ -76,7 +83,7 @@ in {
     map.markers = lib.filter
       (marker: marker.location != null)
       (lib.concatMap (user: [
-        user.departure
+        user.departure user.arrival
       ]) (lib.attrValues config.users));
 
     map.center = lib.mkIf
```

## Connecting user paths

In our path module, we can now define a path spanning from every users
departure location to their arrival location.

```diff
diff --git a/path.nix b/path.nix
index 554a88b..d4a3a84 100644
--- a/path.nix
+++ b/path.nix
@@ -17,6 +17,17 @@ in {
   };
 
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

## Introducing path weight option

Let's also allow some customization of path styles with a `weight` option.
As already done before, we'll declare a submodule for the path style.

While we could also directly define the style.weight option in this
case, we will use the submodule in a future change to reuse the path
style definitions.

Note how we're using a new type for this, `ints.between <lower>
<upper>`, which allows integers in the given inclusive range.

```diff
diff --git a/path.nix b/path.nix
index d4a3a84..88766a8 100644
--- a/path.nix
+++ b/path.nix
@@ -1,11 +1,26 @@
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
@@ -34,7 +49,10 @@ in {
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

## User path styles

Now users can't actually customize the path style yet, so let's
introduce a new `pathStyle` option for each user.

But wait! Didn't we already define the `user` option in the `marker.nix`
module? Yes we did, but the module system actually allows us to declare
an option multiple times, and the module system takes care of merging
each declarations types together (if possible).

```diff
diff --git a/path.nix b/path.nix
index 88766a8..8b56782 100644
--- a/path.nix
+++ b/path.nix
@@ -26,6 +26,16 @@ let
   };
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
@@ -38,6 +48,7 @@ in {
         user.departure.location
         user.arrival.location
       ];
+      style = user.pathStyle;
     }) (lib.filter (user:
       user.departure.location != null
       && user.arrival.location != null
```

## Introducing path color option

Very similar to markers, let's allow customization of the path color,
using types we've seen before already.

```diff
diff --git a/path.nix b/path.nix
index 8b56782..d2073fe 100644
--- a/path.nix
+++ b/path.nix
@@ -1,12 +1,25 @@
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
     options = {
       weight = lib.mkOption {
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
 
@@ -62,6 +75,7 @@ in {
           attributes =
             [
               "weight:${toString path.style.weight}"
+              "color:${path.style.color}"
             ]
             ++ map attrForLocation path.locations;
         in "path=${
```

## Introducing geodesic path option

Finally, another option for the path style, using a new but very simple
type, `bool`, which just allows `true` and `false`.

```diff
diff --git a/path.nix b/path.nix
index d2073fe..ebd9561 100644
--- a/path.nix
+++ b/path.nix
@@ -20,6 +20,11 @@ let
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
 
@@ -76,6 +81,7 @@ in {
             [
               "weight:${toString path.style.weight}"
               "color:${path.style.color}"
+              "geodesic:${lib.boolToString path.style.geodesic}"
             ]
             ++ map attrForLocation path.locations;
         in "path=${
```

