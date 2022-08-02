# Reading the Nix language without fear

The Nix language is used to declare packages and configurations for the Nix package manager.

You will quickly encounter Nix language expressions that may look very complicated.
Yet, the language has only few basic constructs which can be combined arbitrarily.

## What will you learn?

This guide should enable you to read typical Nix language code and understand its structure.

It shows the most common and distingushing patterns in the Nix language:

- assigning names and accessing values
- declaring and calling functions
- referencing file system paths
- working with character strings
- using built-in functions and the standard library
- declaring build inputs and build outputs

It *does not* explain all Nix language features in detail.
See the [Nix manual][manual-language] for a full language reference.

## What do you need?

- Familiarity with other programming languages
<!-- TODO: link to yet-to-be instructions on "how to read command line examples" -->
- Familiarity with Unix shell to read command line examples
- Install the Nix package manager to run the examples
<!-- TODO: approximate amount of time, as observed with test subjects -->

# Basic Concepts

Imagine the Nix language as *JSON with functions*.

The purpose of Nix language is to define structured data.
Functions help with conveniently producing more complex data, and assigning names allows manipulating complex data as units.

To that end, every valid piece of Nix language code is an *expression*.
Evaluating a Nix expression produces a single value.
Every Nix file (`.nix`) contains a single expression.

:::{note}
To *evaluate* means to transform an expression according to the language rules until no further simplification is possible.
:::

## Running examples

All examples in this guide are valid Nix files that you can run yourself.

The following example is a Nix expression adding two numbers:

```nix
1 + 2
```

    3

Use `nix-instantiate --eval` to evaluate the expression in a Nix file.

```console
echo 1 + 2 > file.nix

nix-instantiate --eval file.nix
3
```

:::{note}
`nix-instantiate --eval` will evaluate `default.nix` if no file name is specified.

```console
echo 1 + 2 > default.nix

nix-instantiate --eval
3
```
:::

Use `nix repl` to evaluate Nix expressions interactively (by typing them on the command line):

```console
nix repl
Welcome to Nix 2.5.1. Type :? for help.

nix-repl> 1 + 2
3
```

# Names and values

There are two ways to assign names to values in Nix: attribute sets and `let` expressions.

Assignments are denoted by a single equal sign (`=`).

## Attribute sets

Attribute sets are unordered collections of name-value-pairs.

Together with primitive data types and lists, they work like in JSON and look very similar.

Nix language:

```nix
{
  string = "hello";
  integer = 1;
  float = 3.141;
  bool = true;
  null = null;
  list = [ 1 "two" false ];
  attribute-set = {
    a = "hello";
    b = 2;
    c = 2.718;
    d = false;
  }; # comments are supported
}
```

<!-- would be great to have those side by side -->

JSON:

```json
{
  "string": "hello",
  "integer": 1,
  "float": 3.141,
  "bool": true,
  "null": null,
  "list": [1, "two", false],
  "set": {
    "a": "hello",
    "b": 1,
    "c": 2.718,
    "d": false
  }
}
```

:::{note}
- Attribute names usually do not need quotes.[^1]
- List elements are separated by white space.[^2]
:::

[^1]: Details: [Nix manual - attribute naming rules]()
[^2]: Details: [Nix manual - lists][manual-lists]

[manual-lists]: https://nixos.org/manual/nix/stable/expressions/language-values.html#lists

### Recursive attribute sets

You will sometimes see attribute sets declared with `rec` prepended.
This allows access to attributes from within the set.

Example:

```nix
rec {
  one = 1;
  two = one + 1;
  three = two + 1;
}
```

    { one = 1; three = 3; two = 2; }

Counter-example:

```nix
{
  one = 1;
  two = one + 1;
  three = two + 1;
}
```

    error: undefined variable 'one'

           at «string»:3:9:

                2|   one = 1;
                3|   two = one + 1;
                 |         ^
                4|   three = two + 1;

{ref}`We recommend to avoid the <ref-rec-expression>` and to use the `let` expression instead.

## `let` expression

Also known as “`let` binding” or “`let ... in ...`”.

`let` expressions allow assigning names to values for repeated use.

Example:

```nix
let
  a = 1;
in
a + a
```

    2

As in attribute sets, names can be assigned in any order.
In contrast to attribute sets, the expressions on the right of the assignment can refer to other assigned names.

Example:

```nix
let
  b = a + 1
  a = 1;
in
a + b
```

    3

Only the expressions in the `let` expression can access the newly declared names.
We say: the bindings have local scope.

Counter-example:

```nix
{
  a = let x = 1; in x;
  b = x;
}
```

    error: undefined variable 'x'

           at «string»:3:7:

                2|   a = let x = 1; in x;
                3|   b = x;
                 |       ^
                4| }


<!-- TODO: exercise - use let to reuse a value in an attribute set -->

## Accessing attributes

Attributes in a set can be accessed with a dot (`.`) and the attribute name.

Example:

```nix
let
  attrset = { x = 1; };
in
attrset.x
```

    1

Accessing nested attributes works the same way.

Example:

```nix
let
  attrset = { a = { b = { c = 2; }; }; };
in
attrset.a.b.c
```

    2

## `with`

`with` allows access to attributes without repeatedly referencing their attribute set.

Example:

```nix
let
  a = {
    x = 1;
    y = 2;
    z = 3;
  };
in
with a; [ x y z ]
```

    [ 1 2 3 ]

The expression

    with a; [ x y z ]

is equivalent to

    [ a.x a.y a.z ]

Attributes made available through `with` are only in scope of the expression following the semicolon (`;`).

Counter-example:

```nix
let
  a = {
    x = 1;
    y = 2;
    z = 3;
  };
in
{
  b = with a; [ x y z ];
  c = x;
}
```

    error: undefined variable 'x'

           at «string»:10:7:

                9|   b = with a; [ x y z ];
               10|   c = x;
                 |       ^
               11| }

## `inherit`

One can assign attributes from variables that have the same name with `inherit`.
It is for convenience to avoid repeating the same name multiple times.

Example:

```
let
  x = 1;
  y = 2;
in
{
  inherit x y;
}
```

    { x = 1; y = 2; }

The fragment

    inherit x y;

is equivalent to

    x = x; y = y;

It is also possible to `inherit` attributes from another set with parentheses (`inherit ( ... ) ...`).

Example:

```nix
let
  a = { x = 1; y = 2; };
in
{
  inherit (a) x y;
}
```

    { x = 1; y = 2; }

The fragment

    inherit (a) x y;

is equivalent to

    x = a.x; y = a.y;

# Functions

Functions are everywhere in the Nix language.

## Arguments

Nix functions take exactly one argument.

    x: x + 1

Argument and function body are separated by a colon (`:`).

Wherever you see a colon (`:`) in Nix language code:
- on its left is the function argument
- on its right is the function body.

Applying a function to an argument means writing the argument after the function.

Example

```nix
(x: x + 1) 1
```

    2

Nix functions have no name when declared.
We say they are anonymous, or call such a function a *lambda*.

We can assign functions a name like any to other value.

Example:

```nix
let
  f = x: x + 1;
in
f 1
```

    2

Arguments can be chained.

    x: y: x + y

This can be used like a function that takes two arguments, but offers additional flexibility.

The above function takes one argument and returns a function `y: x + y` with `x` set to the passed value.

Example:

```nix
let
  f = x: y: x + y;
in
f 1
```

    <LAMBDA>

The `<LAMBDA>` indicates the resulting value is an anonymous function.

Applying that to another argument yields the inner body `x + y`, which can now be fully evaluated.

```nix
let
  f = x: y: x + y;
in
f 1 2
```

    3

<!-- TODO: exercise - assign the lambda a name and do something with it -->

## Keyword arguments

Nix functions can explicitly take an attribute set as argument.

    {a, b}: a + b

The argument defines the exact attributes that have to be in that set.
Leaving out or passing additional attributes is an error.

Example:

```nix
let
  f = {a, b}: a + b
in
f { a = 1; b = 2; }
```

    3

## Default attributes

Also known as “default arguments”.

Arguments can have default values for attributes, denoted with a question mark (`?`).

    {a, b ? 0}: a + b

Attributes in the argument are not required if they have a default value.

Example:

```nix
let
  f = {a, b ? 0}: a + b
in
f { a = 1; }
```

    1

Example:

```nix
let
  f = {a ? 0, b ? 0}: a + b
in
f { } # empty attribute set
```

    0

## Additional attributes

Additional attributes are allowed with an ellipsis (`...`):

    {a, b, ...}: a + b

Example:

```nix
let
  f = {a, b, ...}: a + b
in
f { a = 1; b = 2; c = 3; }
```

    3

## Named keyword arguments

Also known as “@ syntax” or “‘at’ syntax”:

    {a, b, ...}@args: a + b + args.c

or

    args@{a, b, ...}: a + b + args.c

where additional attributes are subsumed under a name.

Example:

```nix
let
  f = {a, b, ...}@args: a + b + args.c
in
f { a = 1; b = 2; c = 3; }
```

    6

This can be useful if the passed attribute set also needs to be processed as a whole.

# File system paths

Nix language offers additional convenience for file system paths.[^3]

Absolute paths always start with a slash (`/`):

    /absolute/path

Paths are relative when they contain at least one slash (`/`) but to not start with one.
They are relative to the file containing the expression:

    ./relative

    relative/path

[^3]: Details: [Nix manual - primitive data types][manual-primitives]

## Search path

Also known as “angle bracket syntax”.

    <nixpkgs>

The value of a named path is a file system path that depends on the contents of the [`$NIX_PATH`][NIX_PATH] environment variable.

In practice, `<nixpkgs>` points to the file system path of some revision of the [Nix package collection][nixpkgs].
For example, `<nixpkgs/lib>` points to the subdirectory `lib` of that file system path.

[NIX_PATH]: https://nixos.org/manual/nix/unstable/command-ref/env-common.html?highlight=nix_path#env-NIX_PATH
[nixpkgs]: https://github.org/NixOS/nixpkgs
[manual-primitives]: https://nixos.org/manual/nix/stable/expressions/language-values.html#primitives

# Character strings

<!-- TODO: introduction -->

## String interpolation

<!-- TODO: details -->

```nix
let
  name = "Nix";
in
"hello ${name}"
```

    "hello Nix"

## Indented strings

    ''
      multi
      line
      string
    ''

You will recognize indented strings by *double single quotes*.
Equal amounts of prepended white space are trimmed from the result.

Example:

```nix
''
  one
   two
    three
''
```

    "one\n two\n  three\n"

See [escaping rules]().

<!-- TODO: built-ins and library -->

<!-- TODO: side effects - fetchers and derivations -->

## Summary

As a programming language, Nix is

- *declarative*

  It has no notion of executing sequential steps.
  Dependencies between operations are established only through data.

- *purely functional*

  Pure means: Nix does not change the value of declarations during computation – there are no variables, only names for immutable values.

  Functional means: In Nix, functions are like any other value.
  Functions can be assigned to names, taken as arguments, or returned by functions.

- *lazy*

  It will only evaluate expressions when their result is needed.[^1]

- *dynamically typed*

  Type errors are only detected when operations are actually evaluated.[^2]

- *purpose-built*

  The Nix language only exists for the Nix package manager.
  It is not intended for general purpose use.

[^1]: For example, the built-in function `throw` causes evaluation to stop. However, the following works, because `throw` is never evaluated:

     nix-repl> let lazy = { a = "success"; b = builtins.throw "error"; }; in lazy.a
    "success"

[^2]: For example, while one cannot add integers to strings, the error is only detected when trying to get the result:

    nix-repl> let x = { a = 1 + "1"; b = 2; }; in x.b
    2

    nix-repl> let x = { a = 1 + "1"; b = 2; }; in x.a
    error: cannot add a string to an integer

           at «string»:1:19:

                1| let x = { a = 1 + "1"; b = 2; }; in x.a
                 |                   ^
                2|

