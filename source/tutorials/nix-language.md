(reading-nix-language)=

# Nix language basics

The Nix language is used to declare packages and configurations for the [Nix package manager][nix-manual].

The purpose of Nix language is to define structured data.
It supports functions, for conveniently producing more complex data, and assigning names, for manipulating complex data as units.

It is a domain-specific, purely functional, lazily evaluated, dynamically typed programming language:

- Every valid piece of Nix language code is a *Nix expression*.
- Nix expressions can contain other Nix expressions, that is, they can be nested.
- Evaluating a Nix expression produces a single value.
- Every *Nix file* (`.nix`) contains a single Nix expression.

:::{note}
To *evaluate* means to transform an expression according to the language rules until no further simplification is possible.
:::

[nix-manual]: https://nixos.org/manual/nix/stable/#preface
[nixpkgs-manual]: https://nixos.org/manual/nixpkgs/stable/#preface
[nixos-manual]: https://nixos.org/manual/nixos/stable/index.html#preface
[home-manager]: https://github.com/nix-community/home-manager

Notable uses of the Nix language are:

- [Nix package collection][nixpkgs] (`nixpkgs`)

  It is the largest, most up-to-date software distribution in the world, and written in Nix language.

- [NixOS][nixos-manual], a Linux distribution which can be configured fully declaratively

  The underlying modular configuration system is written in Nix language, and uses packages from `nixpkgs`.
  The operating system environment and services it provides are configured with Nix language.

## Overview

Using the Nix language in practice entails multiple things:

- language: syntax and semantics
- standard libraries: `builtins` and `nixpkgs/lib`
- developer tools: testing, debugging, linting and formatting, ...
- generic build mechanisms: `stdenv`, trivial builders, ...
- composition and configuration mechanisms: `override`, `overrideAttrs`, overlays, `callPackage`, ...
- ecosystem-specific packaging mechanisms: `buildGoModule`, `buildPythonApplication`, ...
- NixOS module system: `config`, `option`, ...

**This guide only covers syntax and semantics**, and will direct you to resources for learning the other components.

### What will you learn?

This guide should enable you to read typical Nix language code and understand its structure.

It shows the most common and distingushing patterns in the Nix language:

- assigning names and accessing values
- declaring and calling functions
- built-in functions and the standard library
- using build inputs and build results


It *does not* explain all Nix language features in detail.
See the [Nix manual][manual-language] for a full language reference.

[manual-language]: https://nixos.org/manual/nix/stable/expressions/expression-language.html

### What do you need?

- Familiarity with software development
- Familiarity with Unix shell, to read command line examples <!-- TODO: link to yet-to-be instructions on "how to read command line examples" -->
- Install the Nix package manager, to run the examples
<!-- TODO: approximate amount of time, as observed with test subjects -->

### How to run the examples?

All examples in this guide are valid Nix expressions that you can run yourself.
They are accompanied by the expected evaluation result.

The following example is a Nix expression adding two numbers:

```nix
1 + 2
```

    3

#### Interactive evaluation

Use `nix repl` to evaluate Nix expressions interactively (by typing them on the command line):

```console
nix repl
```

    Welcome to Nix 2.5.1. Type :? for help.

```console
nix-repl> 1 + 2
```

    3

#### Evaluating Nix files

Use `nix-instantiate --eval` to evaluate the expression in a Nix file.

```console
echo 1 + 2 > file.nix

nix-instantiate --eval file.nix
```

    3

:::{note}
`nix-instantiate --eval` will evaluate `default.nix` if no file name is specified.

```console
echo 1 + 2 > default.nix

nix-instantiate --eval
```

    3
:::

## Reading the Nix language without fear

You will quickly encounter Nix language expressions that may look very complicated.
Yet, the language has only few basic constructs which can be combined arbitrarily.

As with any programming language, the required amount of Nix language code closely matches the complexity of the problem it is supposed to solve, and reflects how well the problem – and its solution – is understood.

Building software is a complex undertaking, and the Nix package manager both exposes and allows managing this complexity with the Nix language.

Most of the software you will want to use with Nix is probably already in the [Nix package collection][nixpkgs], or will be presented to you in ready-made configurations.

Therefore to get started, you should be able to read the Nix language, but may not need to actually write any in the beginning.

If you are familiar with JSON, imagine the Nix language as *JSON with functions*.

## Names and values

There are two ways to assign names to values in Nix: attribute sets and `let` expressions.

Assignments are denoted by a single equal sign (`=`).

### Attribute set `{ ... }`

An attribute set is an unordered collection of name-value-pairs, where names must be unique.

Together with primitive data types and lists, attribute sets work like objects in JSON and look very similar.

<table>
<tr>
  <th>Nix language</th>
  <th>JSON</th>
</tr>
<tr>
<td>

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

</td>
<td>

```json
{
  "string": "hello",
  "integer": 1,
  "float": 3.141,
  "bool": true,
  "null": null,
  "list": [1, "two", false],
  "object": {
    "a": "hello",
    "b": 1,
    "c": 2.718,
    "d": false
  }
}
```

</td>
</tr>
</table>

:::{note}
- Attribute names usually do not need quotes.[^1]
- List elements are separated by white space.[^2]
:::

[^1]: Details: Nix manual - attribute naming rules <!-- TODO: create and link manual section -->
[^2]: Details: [Nix manual - lists][manual-lists]

[manual-lists]: https://nixos.org/manual/nix/stable/expressions/language-values.html#lists

#### Recursive attribute set `rec { ... }`

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

:::{note}
Attribute sets are unordered.
The evaluator prints them in alphabetic order.
:::

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

{ref}`We recommend to avoid recursive sets <rec-expression>` and to use the `let` expression instead.

### `let ... in ...`

Also known as “`let` expression” or “`let` binding”

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

Only expressions within the `let` expression itself can access the newly declared names.
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

### Attribute access

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
  attrset = { a = { b = { c = 1; }; }; };
in
attrset.a.b.c
```

    1

The dot (`.`) notation also works when assigning attributes.

Example:

```nix
let
  attrset = { a.b.c = 1; };
in
attrset
```

    { a = { b = { c = 1; }; }; }

### `with ...; ...`

The `with` expression allows access to attributes without repeatedly referencing their attribute set.

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

### `inherit ...`

With `inherit` one can assign existing names to attributes of the same name.
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

It is also possible to `inherit` attributes from another set with parentheses (`inherit (...) ...`).

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

### File system paths

Nix language offers convenience syntax for file system paths.

Absolute paths always start with a slash (`/`):

    /absolute/path

Paths are relative when they contain at least one slash (`/`) but to not start with one.
They are relative to the file containing the expression:

```nix
./relative
```

```nix
relative/path
```

One dot (`.`) denotes the same directory.
This is typically used to specify the current directory:

```nix
./.
```

Two dots (`..`) denote the parent directory.

### Indented strings

Also known as “multi-line strings”.

Nix language offers convenience syntax for character strings which span multiple lines that have common indentation.

Indented strings are denoted by *double single quotes* (`'' ''`).

Example:

```nix
''
multi
line
string
''
```

    "multi\nline\nstring"

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

<!-- TODO: See [escaping rules](). -->

### Antiquotation

Also known as “string interpolation”.

The value of Nix expressions can be inserted into character strings with `${...}`.

Example:

```nix
let
  name = "Nix";
in
"hello ${name}"
```

    "hello Nix"

Only character strings or values that can be represented as a character string are allowed.

Counter-example:

```nix
let
  x = 1;
in
"${x} + ${x} = ${x + x}"
```

    error: cannot coerce an integer to a string

           at «string»:4:2:

                3| in
                4| "${x} + ${x} = ${x + x}"
                 |  ^
                5|

Antiquotation can be arbitrarily nested.

(This can become hard to read, and we recommend to avoid it in practice.)

Example:

```nix
let
  a = "no";
in
"${a + "${a + " ${a}"}"}"
```

    "no no no"


:::{warning}
You may encounter strings that use the dollar sign (`$`) before an assigned name, but no braces (`{ }`):

These are *not* antiquotations, but usually denote variables in a shell script.

In such cases, the use of names from the surrounding Nix expression is a coincidence.

Example:

```nix
let
  out = "Nix"
in
"echo ${out} > $out"
```

    "echo Nix > $out"

:::

<!-- TODO: link to escaping rules -->

## Functions

Functions are everywhere in the Nix language and deserve particular attention.

### Single argument

Functions in Nix language can appear in different forms, but always take exactly one argument.
Argument and function body are separated by a colon (`:`).

Wherever you see a colon (`:`) in Nix language code:
- on its left is the function argument
- on its right is the function body.

Nix functions have no names.
We say they are anonymous, and call such a function a *lambda*.

Example:

```nix
x: x + 1
```

    <LAMBDA>

The `<LAMBDA>` indicates the resulting value is an anonymous function.

We can assign functions a name as to any other value.

Example:

```nix
let
  f = x: x + 1
in f
```

    <LAMBDA>

### Calling functions

Calling a function with an operand means writing the operand after the function.

Example:

```nix
(x: x + 1) 1
```

    2

:::{note}
Since function and operand are separated by white space, sometimes parantheses (`( )`) are required to distinguish expressions.
:::

Example:

```nix
let
  f = x: x.a;
in
f { a = 1; }
```

    1

The above example calls `f` on a literal attribute set.
One can also pass operands by name.

Example:

```nix
let
  f = x: x.a;
  v = { a = 1; };
in
f v
```

    1


### Chaining arguments

Arguments can be chained by nesting functions.

Such a nested function can be used like a function that takes multiple arguments, but offers additional flexibility.

Example:

```nix
x: y: x + y
```

    <LAMBDA>

The above function takes one argument and returns a function `y: x + y` with `x` set to the passed value.

Example:

```nix
let
  f = x: y: x + y;
in
f 1
```

    <LAMBDA>


Applying that to another argument yields the inner body `x + y`, which can now be fully evaluated.

```nix
let
  f = x: y: x + y;
in
f 1 2
```

    3

<!-- TODO: exercise - assign the lambda a name and do something with it -->

### Attribute set argument

Also known as “keyword arguments”.

Nix functions can explicitly take an attribute set as argument.

This is denoted by listing the expected attribute names separated by commas (`,`) and enclosed in braces (`{ }`).

Example:

```nix
{a, b}: a + b
```

    <LAMBDA>

The argument defines the exact attributes that have to be in that set.
Leaving out or passing additional attributes is an error.

Example:

```nix
let
  f = {a, b}: a + b;
in
f { a = 1; b = 2; }
```

    3

Counter-example:

```nix
let
  f = {a, b}: a + b;
in
f { a = 1; b = 2; c = 3; }
```

    error: 'f' at (string):2:7 called with unexpected argument 'c'

           at «string»:4:1:

                3| in
                4| f { a = 1; b = 2; c = 3; }
                 | ^
                5|

### Default attributes

Also known as “default arguments”.

Arguments can have default values for attributes.

This is denoted by separating the attribute name and its default value with a question mark (`?`).

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

### Additional attributes

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

### Named attribute argument

Also known as “@ pattern”, “@ syntax”, or “‘at’ syntax”.

An attribute set argument can be given a name to be accessible as a whole.

This is denoted by prepending or appending the name to the attribute set argument, separated by the at sign (`@`).

Example:

```nix
{a, b, ...}@args: a + b + args.c
```

    <LAMBDA>

or

```nix
args@{a, b, ...}: a + b + args.c
```
    <LAMBDA>


Example:

```nix
let
  f = {a, b, ...}@args: a + b + args.c
in
f { a = 1; b = 2; c = 3; }
```

    6

#### Search path

Also known as “angle bracket syntax”.

    <nixpkgs>

The value of a named path is a file system path that depends on the contents of the [`$NIX_PATH`][NIX_PATH] environment variable.

In practice, `<nixpkgs>` points to the file system path of some revision of the Nix package collection's source repository [nixpkgs][nixpkgs].
For example, `<nixpkgs/lib>` points to the subdirectory `lib` of that file system path.

While you will see many such examples, we recommend to {ref}`avoid search paths <search-path>` in practice, as they are not fully reproducible.

[NIX_PATH]: https://nixos.org/manual/nix/unstable/command-ref/env-common.html?highlight=nix_path#env-NIX_PATH
[nixpkgs]: https://github.org/NixOS/nixpkgs
[manual-primitives]: https://nixos.org/manual/nix/stable/expressions/language-values.html#primitives

## Function libraries

There are two widely used libraries that *together* can be considered standard for the Nix language.
You need to know about both to understand and navigate Nix language code.

We recommend to at least skim them to familiarise yourself with what is available.

### `builtins`

Nix comes with many functions that are built into the language.

:::{note}
The Nix manual lists all [Built-in Functions][nix-builtins] and shows how to use them.
:::

These functions are available under the `builtins` constant. Example:

    builtins.toString

Most of them are implemented in the Nix language interpreter itself, which means they usually execute faster than their equivalents implemented in the Nix language.

[nix-builtins]: https://nixos.org/manual/nix/stable/expressions/builtins.html

### `pkgs.lib`

The Nix package collection [`nixpkgs`][nixpkgs] contains an attribute set called `lib`, which provides a large number of useful functions.

:::{note}
The `nixpkgs` manual lists all [Nixpkgs library functions][nixpkgs-functions].
:::

These functions are accessed through `pkgs.lib`. Example:

    pkgs.lib.strings.toUpper

[nixpkgs-functions]: https://nixos.org/manual/nixpkgs/stable/#sec-functions-library

## Building software using side effects

So far we have only covered what we call *pure expressions*:
declaring data and transforming it with functions.

Building software requires interaction with the outside world, called *side effects*.

There are two main side effects in the Nix language that are relevant here:
1. Reading files from the file system as build inputs
2. Writing files to the file system as build results

### Build inputs


### Build results

<!-- TODO: side effects - fetchers and derivations -->

See the [Nix Pills][nix-pills] series for a detailed explanation on how Nix the package manager builds software using library functions and packages from the Nix package collection.

[nix-pills]: https://nixos.org/guides/nix-pills/

## Worked examples

You should now be able to read Nix language code for simple packages and configurations, and come up with similiar explanations of the following examples.

Example:

```nix
{ pkgs ? import <nixpkgs> {} }:
let
  message = "hello world";
in
pkgs.mkShell {
  buildInputs = with pkgs; [ cowsay ];
  shellHook = ''
    cowsay ${message}
  '';
}
```

This example declares a shell environment (which runs the `shellHook` on initialization).

Explanation:

- This expression is a function that takes an attribute set as an argument.
- If the argument has the attribute `pkgs`, it will be used in the function body.
  Otherwise, by default, import the Nix expression in the file found on the search path `<nixpkgs>` (which is a function in this case), call the function with an empty attribute set, and use the resulting value.
- The name `message` is bound to the string value `"hello world"`.
- The attribute `mkShell` of the `pkgs` set is a function that is passed an attribute set as argument.
  Its return value is also the result of the outer function.
- The attribute set passed to `mkShell` has the attributes `buildInputs` (set to a list with one element: the `cowsay` attribute from `pkgs`) and `shellHook` (set to an indented string).
- the indented string contains an antiquotation, which will expand to `"hello world"`, the value of `message`


Example:

```nix
{ config, pkgs, ... }: {

  imports = [ ./hardware-configuration.nix ];

  environment.systemPackages = with pkgs; [ git ];

  # ...

}
```

This example is (part of) a NixOS configuration.

Explanation:

- This expression is a function that takes an attribute set as an argument.
  It returns an attribute set.
- The argument must at least have the attributes `config` and `pkgs`, and may have more attributes.
- The returned attribute set contains the attributes `imports` and `environment`.
  `imports` is a list with one element: a path to a file next to this Nix file, called `hardware-configuration.nix`.

  :::{note}
  `imports` is not the impure built-in `import`, but a regular attribute name!
  :::
- `environment` is itself an attribute set with one attribute `systemPackages`, which will evaluate to a list with one element: the `git` attribute from the `pkgs` set.
- The `config` argument is not used.


Example:

```nix
{ lib, stdenv }:

stdenv.mkDerivation rec {

  pname = "hello";

  version = "2.12";

  src = builtins.fetchTarball {
    url = "mirror://gnu/${pname}/${pname}-${version}.tar.gz";
    sha256 = "1ayhp9v4m4rdhjmnl2bq3cibrbqqkgjbl3s7yk2nhlh8vj3ay16g";
  };

  meta = with lib; {
    license = licenses.gpl3Plus;
  };

}
```

This example is a (simplified) package declaration from `nixpkgs`.

Explanation:

- This expression is a function that takes an attribute set which must have exactly the attributes `lib` and `stdenv`.
- It returns the result of evaluating the function `mkDerivaion`, which is an attribute of `stdenv`, applied to a recursive set.
- The recursive set passed to `mkDerivation` uses its own `pname` and `version` attributes in the argument to the built-in function `fetchTarball`.
- The `meta` attribute is itself an attribute set, where the `license` attribute has the value that was assigned to the nested attribute `lib.licenses.gpl3Plus`.

