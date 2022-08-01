# Reading the Nix language

The Nix language is used to declare packages and configurations for the Nix package manager.

You will quickly encounter Nix language expressions that may look very complicated.
Yet, the language has only few basic constructs which can be combined arbitrarily.

## What will you learn?

This guide should enable you to read typical Nix language code and understand its structure.

It shows the most common and distingushing patterns in the Nix language:

- assigning names
- declaring and calling functions
- referencing file system paths
- using built-in functions and the standard library
- declaring build inputs and build outputs

It *does not* explain all Nix language features in detail.
See the [Nix manual][manual-language] for a full language reference.

## What do you need?

- Familiarity with other programming languages
<!-- TODO: link to yet-to-be instructions on "how to read command line examples" -->
- Familiarity with Unix shell to read command line examples
- Install the Nix package manager to run the examples

## Running examples

All examples in this guide are valid Nix files that you can run yourself

The following example is a Nix expression adding two numbers:

    1 + 2

Use `nix-instantiate --eval` to evaluate the expression in a Nix file.

  echo 1 + 2 > file.nix

  nix-instantiate --eval file.nix
  3

:::{note}
`nix-instantiate --eval` will evaluate `default.nix` if no file name is specified.

    echo 1 + 2 > default.nix

    nix-instantiate --eval
    3
:::

Use `nix repl` to evaluate Nix expressions interactively (by typing them on the command line):

    nix repl
    Welcome to Nix 2.5.1. Type :? for help.

    nix-repl> 1 + 2
    3

## Attribute sets

The primary data structure is the attribute set, a collection of key-value pairs.

JSON:

    {
      "string": "hello",
      "integer": 1,
      "float": 3.141,
      "bool": true,
      "null": null,
      "list": [1, 2, 3],
      "set": {
        "a": "hello",
        "b": 1,
        "c": 2.718,
        "d": false
      }
    }

Nix language:

    {
      string = "hello";
      integer = 1;
      float = 3.141;
      bool = true;
      null = null;
      list = [ 1 2 3 ];
      attribute-set = {
        a = "hello";
        b = 2;
        c = 2.718;
        d = false;
      }; # comments are supported
    }

Note: List elements are separated by white space.

Note: The outermost expression does not and must not have a semicolon.

See attribute [naming rules]().

Nix has additional primitives:

### String

#### Multiline string

    nix-repl> ''
              string
              spanning
              multiple
              lines
              ''
    "string\nspanning\nmultiple\nlines\n"

Whitespace that prefixes all lines is stripped automatically.

Multiline strings ease the use of quotes and special characters.

    nix-repl> ''
              "double quoted" and 'single quoted'
              ''
    "\"double quoted\" and 'single quoted'\n"

#### String interpolation

    nix-repl> let
              name = "Nix";
              in
              "hello ${name}"
    "hello Nix"

See escaping rules.

### Path

#### Relative path

    ./relative/path

The path is relative to the file containing the expression.

#### Absolute path

    /absolute/path

#### Home directory path

    ~/path/in/home/directory

#### Named paths

Also known as “angle bracket syntax”.

    <name>

Examples:

    # write a Nix expression to a file
    echo 123 > nix_path_file

    # set `NIX_PATH` to point a name to that file
    env NIX_PATH=name_in_nix_path=nix_path_file nix repl

    nix repl> import <name_in_nix_path>
    123

Nix simply reads and parses the `NIX_PATH` environment variable.
Entries are separated by colons (`:`).

Note: The value of a named path depends on external system state. Therefore it is recommended not to use them.

#### Path concatenation

    /nix + /store

Paths can be concatenated with each other or with strings.

Examples:

    nix-repl> /nix + /store
    /nix/store

    nix-repl> /nix/var + "/nix"
    /nix/var/nix

### Let bindings

    nix-repl> let a = 1; in a + a
    2

Let bindings allow declaring named values for repeated use.

### Recursive sets

Recursive sets allow elements to refer to attributes within the set.
They are constructed with the `rec` keyword.

    nix-repl> rec { a = 1; b = a + a; }
    { a = 1; b = 2; }

Note: This construct
- allows infinite recursion, such as `rec { x = x; }.x`
- can quickly become hard to understand.
Therefore it is recommended to use let bindings instead.

    nix-repl> let x = 1; in { a = x; b = x + x; }
    { a = 1; b = 2; }

## Functions

The Nix language is Turing-complete.
It gives you the power to tame complexity and the freedom to create overwhelming amounts of it.

Therefore, it is recommended to use functions sparingly and instead think more in terms of data, because data is usually easier to understand.


### Arguments

Nix functions take exactly one argument.

    x: x + 1

Argument and function body are separated by a colon `:`.

Applying a function to an argument means writing the argument after the function name.

Example:

    nix-repl> let
              f = x: x + 1;
              in
              f 1
    2

Arguments can be chained.

    x: y: x + y

The above function takes one argument and returns a function `y: x + y` with `x` set to passed value. 

Example:

    nix-repl> let
              f = x: y: x + y;
              in
              f 1
    «lambda @ (string):2:8»

The `lambda` indicates the resulting value is a function.

Applying that to another argument yields the inner body `x + y`, which can now be fully evaluated.

    nix-repl> let
              f = x: y: x + y;
              in
              f 1 2
    3

### Keyword arguments

Nix functions can explicitly take an attribute set as argument.

    {a, b}: a + b

This is equivalent to

    x: x.a + a.b

The argument defines the exact attributes that have to be in that set.
Leaving out or passing additional attributes is an error.

Example:

    nix-repl> let
              f = {a, b}: a + b
              in
              f { a = 1; b = 2; }
    3

### Default attributes

Also known as “default arguments”.

Arguments can have default values for attributes, denoted with a question mark “?”.

    {a, b ? 0}: a + b

Attributes in the argument are not required if they have a default value.

Example:

    nix-repl> let
              f = {a, b ? 0}: a + b
              in
              f { a = 1; }
    1

Example:

    nix-repl> let
              f = {a ? 0, b ? 0}: a + b
              in
              f { } # empty attribute set
    0

### Additional attributes

You can allow additional attributes with an ellipsis (`...`):

    {a, b, ...}: a + b

Example:

    nix-repl> let
              f = {a, b, ...}: a + b
              in
              f { a = 1; b = 2; c = 3; }
    3

### Named keyword arguments

Also known as “@ syntax” or “‘at’ syntax”.

    {a, b, ...}@args: a + b + args.c

or

    args@{a, b, ...}: a + b + args.c

where additional attributes are subsumed under a name.

Example:

    nix-repl> let
              f = {a, b, ...}@args: a + b + args.c
              in
              f { a = 1; b = 2; c = 3; }
    6

This can be useful if this remaining attribute set needs to be processed as a whole.


## Summary

As a programming language, Nix is

- *declarative*

  It has no notion of executing sequential steps.
  Dependencies between operations are established only through data.
  Everything in Nix is an expression that results in a single value.
  Every Nix file (`.nix`) contains a single expression.

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

