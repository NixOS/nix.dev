(reading-nix-language)=

# Nix language basics

The Nix language is used to declare packages and configurations for the [Nix package manager][nix-manual].

It is a domain-specific, purely functional, lazily evaluated, dynamically typed programming language.

Notable uses of the Nix language are:

- [Nix package collection][nixpkgs] (`nixpkgs`)

  It is the largest, most up-to-date software distribution in the world, and written in Nix language.

- [NixOS][nixos-manual] Linux distribution

  It is based on the Nix package manager, and can be configured fully declaratively.

  Its underlying modular configuration system is written in Nix language, and uses packages from `nixpkgs`.
  The operating system environment and services it provides are configured with Nix language.

[nix-manual]: https://nixos.org/manual/nix/stable/#preface
[nixpkgs-manual]: https://nixos.org/manual/nixpkgs/stable/#preface
[nixos-manual]: https://nixos.org/manual/nixos/stable/index.html#preface
[home-manager]: https://github.com/nix-community/home-manager

## Overview

Using the Nix language in practice entails multiple things:

- language: syntax and semantics
- function libraries: `builtins` and `nixpkgs/lib`
- developer tools: testing, debugging, linting and formatting, ...
- generic build mechanisms: `stdenv`, trivial builders, ...
- composition and configuration mechanisms: `override`, `overrideAttrs`, overlays, `callPackage`, ...
- ecosystem-specific packaging mechanisms: `buildGoModule`, `buildPythonApplication`, ...
- NixOS module system: `config`, `option`, ...

**This guide only covers language syntax and semantics**, briefly discusses function libraries, and at the end will direct you to resources on the other components.

### What will you learn?

This guide should enable you to read typical Nix language code and understand its structure.

It shows the most common and distingushing patterns in the Nix language:

- assigning names and accessing values
- declaring and calling functions
- built-in and library functions
- side effects to obtain build inputs and produce build results

It *does not* explain all Nix language features in detail.
See the [Nix manual][manual-language] for a full language reference.

[manual-language]: https://nixos.org/manual/nix/stable/expressions/expression-language.html

### What do you need?

- Familiarity with software development
- Familiarity with Unix shell, to read command line examples <!-- TODO: link to yet-to-be instructions on "how to read command line examples" -->
- Install the Nix package manager, to run the examples
<!-- TODO: approximate amount of time, as observed with test subjects -->

### How long does it take?

Carefully working through all definitions and examples, and reading all detailed explanations should take ca. 2 hours.

If you are proficient in procedural or object-oriented programming, learning syntax and semantics by examining all examples should take ca. 1 hour.

If you are familiar with functional programming, the Nix language will be largely unsurprizing.
Reading through the guide to get accustomed to the syntax should take ca. 30 minutes.

### How to run the examples?

- Every valid piece of Nix language code is a *Nix expression*.
- Nix expressions can contain other Nix expressions, that is, they can be nested.
- Evaluating a Nix expression produces a single value.
- Every *Nix file* (`.nix`) contains a single Nix expression.

:::{note}
To *evaluate* means to transform an expression according to the language rules until no further simplification is possible.
:::

All examples in this guide are valid Nix expressions.
Each one is followed by the expected evaluation result.

The following example is a Nix expression adding two numbers:

```nix
1 + 2
```

    3

#### Interactive evaluation

Use [`nix repl`][nix-repl] to evaluate Nix expressions interactively (by typing them on the command line):

```console
nix repl
```

    Welcome to Nix 2.5.1. Type :? for help.

```console
nix-repl> 1 + 2
```

    3

[nix-repl]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-repl.html

#### Evaluating Nix files

Use [`nix-instantiate --eval`][nix-instantiate] to evaluate the expression in a Nix file.

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

[nix-instantiate]: https://nixos.org/manual/nix/stable/command-ref/nix-instantiate.html

## Reading the Nix language without fear

You will quickly encounter Nix language expressions that may look very complicated.

As with any programming language, the required amount of Nix language code closely matches the complexity of the problem it is supposed to solve, and reflects how well the problem – and its solution – is understood.

Building software is a complex undertaking, and the Nix package manager both exposes and allows managing this complexity with the Nix language.

The purpose of the Nix language is to create *build tasks*: precise descriptions of how contents of existing files are used to derive new files.

:::{important}
A build task in the Nix package manager is called *derivation*.
:::

The Nix language has only few basic constructs which can be combined arbitrarily:

- primitive data types

  as basic building blocks

- compound data types and functions

  to produce and transform complex data

- name assignment

  to manipulate complex data as units

In addition it allows three side effects:

  - reading files as Nix expressions

    to enable code reuse

  - reading files as *build inputs*

    to capture what build tasks will operate on

  - writing files as *build tasks*

    to keep them for later execution, the *build*

There is nothing else to it.

What may look complicated comes not from the language, but from how it is used.

## Names and values

There are two ways to assign names to values in Nix: attribute sets and `let` expressions.

Assignments are denoted by a single equal sign (`=`).

### Attribute set `{ ... }`

An attribute set is an unordered collection of name-value-pairs, where names must be unique.

The following example shows all primitive data types, lists, and attribute sets.

:::{note}
If you are familiar with JSON, imagine the Nix language as *JSON with functions*.

Nix language data types *without functions* work just like their counterparts in JSON and look very similar.
:::


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

It is also possible to `inherit` names from a specific attribute set with parentheses (`inherit (...) ...`).

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

#### Search path

Also known as “angle bracket syntax”.

    <nixpkgs>

The value of a named path is a file system path that depends on the contents of the [`$NIX_PATH`][NIX_PATH] environment variable.

In practice, `<nixpkgs>` points to the file system path of some revision of the Nix package collection's source repository [`nixpkgs`][nixpkgs].
For example, `<nixpkgs/lib>` points to the subdirectory `lib` of that file system path.

While you will see many such examples, we recommend to {ref}`avoid search paths <search-path>` in practice, as they are not fully reproducible.

[NIX_PATH]: https://nixos.org/manual/nix/unstable/command-ref/env-common.html?highlight=nix_path#env-NIX_PATH
[nixpkgs]: https://github.org/NixOS/nixpkgs
[manual-primitives]: https://nixos.org/manual/nix/stable/expressions/language-values.html#primitives

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

(antiquotation)=
### Antiquotation `${ ... }`

Also known as “string interpolation”.

The value of a Nix expression can be inserted into a character string with the dollar-sign and braces (`${ }`).

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

Also known as "function application".

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

The above function takes one argument and returns a function `y: x + y` with `x` set to the value of the argument.

Example:

```nix
let
  f = x: y: x + y;
in
f 1
```

    <LAMBDA>


Applying that function `f 1` to another argument yields the inner body `x + y` (with `x` set to `1` and `y` set to the other argument), which can now be fully evaluated.

```nix
let
  f = x: y: x + y;
in
f 1 2
```

    3

<!-- TODO: exercise - assign the lambda a name and do something with it -->

### Attribute set argument

Also known as “keyword arguments” or “destructuring” .

Nix functions can be declared to require an attribute set with specific structure as argument.

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


<!-- TODO: not the same as x: x.a + x.b (!!!!) -->

### Default attributes

Also known as “default arguments”.

Destructured arguments can have default values for attributes.

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


## Function libraries

There are two widely used libraries that *together* can be considered standard for the Nix language.
You need to know about both to understand and navigate Nix language code.

<!-- TODO: find a place for operators -->

We recommend to at least skim them to familiarise yourself with what is available.

### `builtins`

Nix comes with many functions that are built into the language.

:::{note}
The Nix manual lists all [Built-in Functions][nix-builtins], and shows how to use them.
:::

These functions are available under the `builtins` constant.

Example:

    builtins.toString

Most of them are implemented in the Nix language interpreter itself, which means they usually execute faster than their equivalents implemented in the Nix language.

[nix-operators]: https://nixos.org/manual/nix/unstable/language/operators.html
[nix-builtins]: https://nixos.org/manual/nix/stable/expressions/builtins.html

### `pkgs.lib`

The Nix package collection [`nixpkgs`][nixpkgs] contains an attribute set called `lib`, which provides a large number of useful functions.

:::{note}
The `nixpkgs` manual lists all [Nixpkgs library functions][nixpkgs-functions].
:::

These functions are usually accessed through `pkgs.lib`.

Example:

    pkgs.lib.strings.toUpper

[nixpkgs-functions]: https://nixos.org/manual/nixpkgs/stable/#sec-functions-library

## Building software with side effects

So far we have only covered what we call *pure expressions*:
declaring data and transforming it with functions.

Building software requires interaction with the outside world, called *side effects*.

There are three side effects in the Nix language that are relevant here:

1. Importing Nix expressions from other files
2. Reading files from the file system as build inputs
3. Writing files to the file system as build tasks

Side effects are performed while evaluating a given impure expression.

### Imports

The built-in function `import` takes a path to a Nix file, and reads it to evaluate the contained Nix expression.

Example:

```console
echo 1 + 2 > file.nix
```

```nix
import ./file.nix
```

    3

Example:

```console
echo "x: x + 1" > file.nix
```

```nix
import ./file.nix 1
```

    2

It is an error if the file system path does not exist.

### Build inputs

Build inputs are files that build tasks refer to in their precise description of how to derive new files.

Since Nix language evaluation is otherwise pure, the only way to specify build inputs is explicitly with:
- file system paths
- dedicated impure functions.

When run, a build task will only have access to explicitly declared build inputs.

:::{important}
Purity is the key to reproducible builds.

It precludes build tasks from referring to files which are not explicitly specified as build inputs.
:::

#### Paths

Whenever a file system path is rendered to a character string with [antiquotation](antiquotation), the contents of that file are copied to a special location in the file system, the *Nix store*.

The evaluated string then contains the Nix store path assigned to that file.

<!-- TODO: link to explanation of the Nix store -->

Example:

```console
echo 123 > data
```

```nix
"${./data}"
```

    "/nix/store/h1qj5h5n05b5dl5q4nldrqq8mdg7dhqk-data"

<details><summary>Detailed explanation</summary>

The preceding shell command writes the characters `123` to the file `data` in the current directory.

Evaluating the Nix expression referencing this file as `./data` produces a file system path.

Only values that can be represented as a character string are allowed for [antiquotation](antiquotation).
A file system path is such a value, and its character string representation is the corresponding Nix store path.

The Nix store path is obtained by taking the hash of the file's contents and combining it with the file name.
The resulting file is placed into the Nix store directory `/nix/store`:

    /nix/store/<hash>-<name>

</details>

It is an error if the file system path does not exist.

#### Fetchers

Files to be used as build inputs do not have to come from the file system.

The Nix language provides built-in impure functions to fetch files over the network during evaluation:

- [builtins.fetchurl][fetchurl]
- [builtins.fetchTarball][fetchTarball]
- [builtins.fetchGit][fetchGit]
- [builtins.fetchClosure][fetchClosure]

These functions evaluate to a file system path in the Nix store.

Example:

```nix
builtins.fetchurl https://github.com/NixOS/nix/archive/7c3ab5751568a0bc63430b33a5169c5e4784a0ff.tar.gz
```

    "/nix/store/7dhgs330clj36384akg86140fqkgh8zf-7c3ab5751568a0bc63430b33a5169c5e4784a0ff.tar.gz"

Some of them add extra convenience, such as automatically unpacking archives.

Example:

```nix
builtins.fetchTarball https://github.com/NixOS/nix/archive/7c3ab5751568a0bc63430b33a5169c5e4784a0ff.tar.gz
```

    "/nix/store/d59llm96vgis5fy231x6m7nrijs0ww36-source"

:::{note}
The `nixpkgs` manual on [Fetchers][nixpkgs-fetchers] lists numerous additional library functions to fetch files over the network.
:::

It is an error if the network request fails.

[fetchurl]: https://nixos.org/manual/nix/stable/expressions/builtins.html#builtins-fetchurl
[fetchTarball]: https://nixos.org/manual/nix/stable/expressions/builtins.html#builtins-fetchTarball
[fetchGit]: https://nixos.org/manual/nix/stable/expressions/builtins.html#builtins-fetchGit
[fetchClosure]: https://nixos.org/manual/nix/stable/expressions/builtins.html#builtins-fetchClosure
[nixpkgs-fetchers]: https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers

### Build tasks

A build task in the Nix package manager is called *derivation*.

Derivations are at the core of both the Nix package manager and the Nix language:
- The Nix language is used to produce build tasks.
- The Nix package manager runs build tasks to produce *build results*.
- Build results can in turn be used as inputs for other build tasks.

The Nix language primitive to declare a build task is the built-in impure function `derivation`.

:::{note}
You will probably never encounter `derivation` in practice.

It is usually wrapped by the `nixpkgs` build mechanism `stdenv.mkDerivation`, which hides much of the complexity involved in non-trivial build procedures.
:::

Two things happen when evaluating `derivation`:

- The build task is written to the Nix store as a `.drv` file.

  The process is called *instantiation*, and the resulting file is called *store derivation*.

- The expression evaluates to a special derivation value.

  It behaves like an attribute set, except that it can be used in antiquotation.

  :::{important}
  The character string representation of a derivation is the Nix store path of its build result.

  This Nix store path will contain the build result when the derivation is built.

  It is different from the path of the store derivation, which is the build task for that build result.
  :::

Example:

```nix
builtins.derivation {
  name = "example";
  builder = /bin/sh;
  args = ["-c" "echo hello > $out"];
  system = "x86_64-darwin";
}
```

    «derivation /nix/store/ccdzzm0mzmavzmf8vyr6wx95ihm2lpzr-example.drv»

The following example shows the different appearances of that derivation:

```nix
let
  drv = builtins.derivation {
    name = "example";
    builder = /bin/sh;
    args = ["-c" "echo hello > $out"];
    system = "x86_64-darwin";
  };
in [ drv "${drv}" drv.name ]
```

    [ «derivation /nix/store/ccdzzm0mzmavzmf8vyr6wx95ihm2lpzr-example.drv» "/nix/store/spvfs5qfrf113ll4vhcc5lby4gqmc532-example" "example" ]

The build itself is performed by running the executable file referred to by the `builder` attribute in the argument to `derivation`.

The `builder` file can be the build result of a different derivation.
In the Nix language, we can refer to that file using the character string representation of its derivation – before the derivatiothe derivation has been built.

This allows constructing arbitrarily complex compositions of derivations with the Nix language.
Evaluating such an expression will produce a collection of `.drv` files (store derivations) as a side effect.
The Nix package manager will then build them in correct order and write all (including the intermediate) build results to the Nix store.

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

## References

- [Nix manual: Nix language][manual-language] - Nix language reference
- [Nix manual: Built-in Functions][nix-builtins] - Nix language built-in functions
- [Nixpkgs manual: Functions reference][nixpkgs-functions] - `nixpkgs` function library
- [Nixpkgs manual: Fetchers][nixpkgs-fetchers] - `nixpkgs` fetcher library

## Next steps

To get things done:

- [](declarative-reproducible-envs) – create reproducible shell environments from a Nix file
- [Garbage Collection](https://nixos.org/manual/nix/stable/package-management/garbage-collection.html) – remove unused build results from the Nix store

To learn more:

If you worked through the examples, you will have noticed that reading the Nix language reveals the structure of the code, but does not necessarily tell what the code actually means.

Often it is not possible to determine from the code at hand
- the data type of a named value or function argument.
- the data type a called function accepts for its operand.
- which attributes are present in a given attribute set.

Example:

```nix
{ x, y, z }: (x y) z.a
```

How do we know
- that `x` will be a function that, given an operand, returns a function?
- that, given `x` is a function, `y` will be an appropriate operand to `x`?
- that, given `(x y)` is a function, `z.a` will be an appropriate operand to `(x y)`?
- that `z` will be an attribute set at all?
- that, given `z` is an attribute set, it will have an attribute `a`?
- which data type `y` and `z.a` will be?
- the data type of the end result?

And how does the caller of this function know that it requires an attribute set with attributes `x`, `y`, `z`?

Answering such questions requires a knowing the context in which a given expression is supposed to be used.

The Nix ecosystem and code style is driven by conventions.
Most names you will encounter in Nix language code come from the Nix package collection `nixpkgs`:

- [Nix Pills][nix-pills] - a detailed explanation of derivations and how the Nix package collection is constructed from first principles

`nixpkgs` provides generic build mechanisms that are widely used:

- [`stdenv`][stdenv] - most importantly `mkDerivation`
- [Trivial Builders][trivial-builders] - to create files and shell scripts

Packages from `nixpkgs` can be modified through multiple mechanisms:

- [overrides] – specifically `override` and `overrideAttrs` to modify single packages
- [overlays] – to produce a custom variant of `nixpkgs` with individually modified packages

Different language ecosystems and frameworks have different requirements to accommodating them into `nixpkgs`:

- [Languages and frameworks][language-support] lists tools provided by `nixpkgs` to build language- or framework-specific packages with the Nix package manager.

The NixOS Linux distribution has a modular configuration system that imposes its own conventions:

- [NixOS modules][nixos-modules] shows how NixOS configurations are organized.

[nix-pills]: https://nixos.org/guides/nix-pills/
[stdenv]: https://nixos.org/manual/nixpkgs/stable/#chap-stdenv
[trivial-builders]: https://nixos.org/manual/nixpkgs/stable/#chap-trivial-builders
[overlays]: https://nixos.org/manual/nixpkgs/stable/#chap-overlays
[overrides]: https://nixos.org/manual/nixpkgs/stable/#chap-overrides
[language-support]: https://nixos.org/manual/nixpkgs/stable/#chap-language-support
[nixos-modules]: https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules

