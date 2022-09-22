(reading-nix-language)=

# Nix language basics

The Nix language is used to declare packages and configurations for [Nix][nix-manual].

It is a domain-specific, purely functional, lazily evaluated, dynamically typed programming language.

Notable uses of the Nix language are:

- [Nixpkgs][nixpkgs]

  The largest, most up-to-date software distribution in the world, and written in the Nix language.

- [NixOS][nixos-manual]

  Linux distribution that can be configured fully declaratively and is based on Nix.

  Its underlying modular configuration system is written in the Nix language, and uses packages from Nixpkgs.
  The operating system environment and services it provides are configured with the Nix language.

[nix-manual]: https://nixos.org/manual/nix/stable
[nixpkgs-manual]: https://nixos.org/manual/nixpkgs/stable/#preface
[nixos-manual]: https://nixos.org/manual/nixos/stable/index.html#preface
[home-manager]: https://github.com/nix-community/home-manager

## Overview

Using the Nix language in practice entails multiple things:

- Language: syntax and semantics
- Libraries: `builtins` and `pkgs.lib`
- Developer tools: testing, debugging, linting, formatting, ...
- Generic build mechanisms: `stdenv.mkDerivation`, trivial builders, ...
- Composition and configuration mechanisms: `override`, `overrideAttrs`, overlays, `callPackage`, ...
- Ecosystem-specific packaging mechanisms: `buildGoModule`, `buildPythonApplication`, ...
- NixOS module system: `config`, `option`, ...

**This guide only covers language syntax and semantics**, briefly discusses libraries, and at the end will direct you to resources on the other components.

### What will you learn?

This guide should enable you to read typical Nix language code and understand its structure.

It shows the most common and distingushing patterns in the Nix language:

- [Assigning names and accessing values](names-values)
- Declaring and calling [functions](functions)
- [Built-in and library functions](libraries)
- [Side effects](side-effects) to obtain build inputs and produce build results

It *does not* explain all Nix language features in detail.
See the [Nix manual][manual-language] for a full language reference.

[manual-language]: https://nixos.org/manual/nix/stable/language/index.html

### How long does it take?

- No experience with functional programming: 2 hours
- Familiar with functional programming: 1 hour
- Proficient with functional programming: 30 minutes

We recommend to run all examples.
Play with them to validate your assumptions and test what you have learned.
Read detailed explanations if you want to make sure you fully understand the examples.

### What do you need?

- Familiarity with software development
- Familiarity with Unix shell, to read command line examples <!-- TODO: link to yet-to-be instructions on "how to read command line examples" -->
- A [Nix installation](./install-nix) to run the examples

### How to run the examples?

- A piece of Nix language code is a *Nix expression*.
- Evaluating a Nix expression produces a *Nix value*.
- The content of a *Nix file* (file extension `.nix`) is a Nix expression.

:::{note}
To *evaluate* means to transform an expression into a value according to the language rules.
:::

This guide contains many examples of Nix expressions.
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

:::{note}
The Nix language by default uses lazy evaluation, and will only compute values when needed.

Some examples show results of strict evaluation for clarity.
If your output does not match the example, try prepending `:p` to the input expression.

Example:

```console
nix-repl> { a.b.c = 1; }
```

    { a = { ... }; }


```console
nix-repl> :p { a.b.c = 1; }
```

    { a = { b = { c = 1; }; }; }

:::

[nix-repl]: https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-repl.html

#### Evaluating Nix files

Use [`nix-instantiate --eval`][nix-instantiate] to evaluate the expression in a Nix file.

```console
echo 1 + 2 > file.nix

nix-instantiate --eval file.nix
```

    3

<details><summary>Detailed explanation</summary>

The first command writes `1 + 2` to a file `file.nix` in the current directory.
The contents of `file.nix` are now `1 + 2`, which you can check with

```console
cat file.nix
```

    1 + 2

The second command runs `nix-instantiate` with the `--eval` option on `file.nix`, which reads the file and evaluates the contained Nix expression.
The resulting value is printed as output.

`--eval` is required to evaluate the file and do nothing else.
If `--eval` is omitted, `nix-instantiate` expects the expression in the given file to evaluate to a special value called *Derivation*, which we will come back to at the end of this guide in [](build-tasks).

If you do not need `file.nix` any more, remove it with

```console
rm file.nix
```

</details>

:::{note}
`nix-instantiate --eval` will evaluate `default.nix` if no file name is specified.

```console
echo 1 + 2 > default.nix

nix-instantiate --eval
```

    3
:::

:::{note}
The Nix language by default uses lazy evaluation, and will only compute values when needed.

Some examples show results of strict evaluation for clarity.
If your output does not match the example, try adding the `--strict` option to `nix-instantiate`.

Example:

```console
echo "{ a.b.c = 1; }" > file.nix

nix-instantiate --eval file.nix
```

    { a = <CODE>; }


```console
echo "{ a.b.c = 1; }" > file.nix

nix-instantiate --eval --strict file.nix
```

    { a = { b = { c = 1; }; }; }

:::

[nix-instantiate]: https://nixos.org/manual/nix/stable/command-ref/nix-instantiate.html

## Reading the Nix language without fear

You may quickly encounter Nix language expressions that look very complicated.

As with any programming language, the required amount of Nix language code closely matches the complexity of the problem it is supposed to solve, and reflects how well the problem – and its solution – is understood.

Building software is a complex undertaking, and Nix both *exposes* and *allows managing* this complexity with the Nix language.

The purpose of the Nix language is to create *build tasks*: precise descriptions of how contents of existing files are used to derive new files.

:::{important}
A build task in Nix is called *derivation*.
:::

The Nix language has only few basic constructs which can be combined arbitrarily:

- Primitive data types

  as basic building blocks

- Compound data types and functions

  to produce and transform complex data

- Name assignment

  to manipulate complex data as units

In addition it allows three side effects:

  - Reading files as Nix expressions

    to enable code reuse

  - Reading files as *build inputs*

    to capture what build tasks will operate on

  - Writing files as *build tasks*

    to keep them for later execution, the *build*

There is nothing else to it.
What may look complicated comes not from the language, but from how it is used.

(names-values)=
## Names and values

Values in the Nix language can be primitive data types, lists, attribute sets, and functions.

We show primitve data types and lists as examples in the context of [attribute sets](attrset).
Later in this section we cover special features of character strings: [file system paths](file-system-paths), [indented strings](indented-strings), and [antiquotation](antiquotation).
We deal with [functions](functions) separately.

There are two ways to assign names to values in Nix: attribute sets and `let` expressions.

Assignments are denoted by a single equal sign (`=`).

(attrset)=
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

[manual-lists]: https://nixos.org/manual/nix/stable/language/values.html#list

(rec-attrset)=
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

<details><summary>Detailed explanation</summary>

Assignments are placed between the keywords `let` and `in`.
In this example we assign `a = 1`.

After `in` comes the expression in which the assignments are valid, i.e., where assigned names can be used.
In this example the expression is `a + a`, where `a` refers to `a = 1`.

By replacing the names with their assigned values, `a + a` evaluates to `2`.

</details>

Names can be assigned in any order, and expressions on the right of the assignment (`=`) can refer to other assigned names.

Example:

```nix
let
  b = a + 1;
  a = 1;
in
a + b
```

    3


<details><summary>Detailed explanation</summary>

Assignments are placed between the keywords `let` and `in`.
In this example we assign `a = 1` and `b = a + 1`.

The order of assignments does not matter.
Therefore the following example, where the assignments are in reverse order, is equivalent:


```nix
let
  a = 1;
  b = a + 1;
in
a + b
```

    3

Note that the `a` in `b = a + 1` refers to `a = 1`.

After `in` comes the expression in which the assignments are valid.
In this example the expression is `a + b`, where `a` refers to `a = 1`, and `b` refers to `b = a + 1`.

By replacing the names with their assigned values, `a + b` evaluates to `3`.

This is similar to [recursive attribute sets](rec-attrset):
in both, the order of assignments does not matter, and names on the left can be used in expressions on the right of the assignment (`=`).

Example:

<table>
<tr>
  <th>

`let ... in ...`

  </th>
  <th>

`rec { ... }`

  </th>
</tr>
<tr>
<td>

```nix
let
  b = a + 1;
  c = a + b;
  a = 1;
in {  c = c; a = a; b = b; }
```

    { a = 1; b = 2; c = 3; }

</td>
<td>

```nix
rec {
  b = a + 1;
  c = a + b;
  a = 1;
}
```

    { a = 1; b = 2; c = 3; }

</td>
</tr>
</table>

The difference is that while a recursive attribute set evaluates to an [attribute set](attrset), any expression can follow after the `in` keyword.

In the following example we use the `let` expression to form a list:


```nix
let
  b = a + 1;
  c = a + b;
  a = 1;
in [ a b c ]
```

    [ 1 2 3 ]

</details>

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

Attributes in a set are accessed with a dot (`.`) and the attribute name.

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

The dot (`.`) notation can also be used for assigning attributes.

Example:

```nix
let
  attrset = { a.b.c = 1; };
in
attrset
```

    { a = { b = { c = 1; }; }; }

(with)=
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

With `inherit` one can assign values behind existing names to attributes with the same names.
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

(file-system-paths)=
### File system paths

The Nix language offers convenience syntax for file system paths.

Absolute paths always start with a slash (`/`).

Example:

```nix
/absolute/path
```

    /absolute/path

Paths are relative when they contain at least one slash (`/`) but to not start with one.
They evaluate to the path relative to the file containing the expression.

The following examples assume the containing Nix file is in `/current/directory` (or `nix repl` is run in `/current/directory`).

Example:


```nix
./relative
```

    /current/directory/relative

Example:

```nix
relative/path
```

    /current/directory/relative/path


One dot (`.`) denotes the current directory within the given path.

You will often see the following expression, which specifies a Nix file's directory.

Example:

```nix
./.
```

    /current/directory

<details><summary>Detailed explanation</summary>

Since relative paths must contain a slash (`/`) but must not start with one, and the dot (`.`) denotes no change of directory, the combination `./.` specifies the current directory as a relative path.

</details>

Two dots (`..`) denote the parent directory.


Example:


```nix
../.
```

    /current

#### Search path

Also known as “angle bracket syntax”.

    <nixpkgs>

The value of a named path is a file system path that depends on the contents of the [`$NIX_PATH`][NIX_PATH] environment variable.

In practice, `<nixpkgs>` points to the file system path of some revision of [`nixpkgs`][nixpkgs], the source repository of Nixpkgs.
For example, `<nixpkgs/lib>` points to the subdirectory `lib` of that file system path.

While you will see many such examples, we recommend to [avoid search paths](search-path) in practice, as they are not reproducible.

[NIX_PATH]: https://nixos.org/manual/nix/unstable/command-ref/env-common.html?highlight=nix_path#env-NIX_PATH
[nixpkgs]: https://github.com/NixOS/nixpkgs
[manual-primitives]: https://nixos.org/manual/nix/stable/language/values.html#primitives

(indented-strings)=
### Indented strings

Also known as “multi-line strings”.

The Nix language offers convenience syntax for character strings which span multiple lines that have common indentation.

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
  out = "Nix";
in
"echo ${out} > $out"
```

    "echo Nix > $out"
:::

<!-- TODO: link to escaping rules -->

(functions)=
## Functions

Functions are everywhere in the Nix language and deserve particular attention.

A function always takes exactly one argument.
Argument and function body are separated by a colon (`:`).

Wherever you see a colon (`:`) in Nix language code:
- On its left is the function argument
- On its right is the function body.

Functions in the Nix language can appear in different forms:

- single argument:

  ```nix
  x: x + 1
  ```

  - multiple arguments via nesting

    ```nix
    x: y: x + y
    ```

- attribute set argument

  ```nix
  { a, b }: a + b
  ```

  - with default attributes

    ```nix
    { a, b ? 0 }: a + b
    ```

  - with additional attributes allowed

    ```nix
    { a, b, ...}: a + b
    ```

- named attribute set argument

  ```nix
  args@{ a, b, ... }: a + b + args.c
  ```

  or

  ```nix
  { a, b, ... }@args: a + b + args.c
  ```

Functions have no names.
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
  f = x: x + 1;
in f
```

    <LAMBDA>

### Calling functions

Also known as "function application".

Calling a function with an argument means writing the argument after the function.

Example:

```nix
(x: x + 1) 1
```

    2

:::{note}
Since function and argument are separated by white space, sometimes parantheses (`( )`) are required to distinguish expressions.
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
One can also pass arguments by name.

Example:

```nix
let
  f = x: x.a;
  v = { a = 1; };
in
f v
```

    1

#### Multiple arguments

Nix functions take exactly one argument.
Multiple arguments can be handled by nesting functions.

Such a nested function can be used like a function that takes multiple arguments, but offers additional flexibility.

Example:

```nix
x: y: x + y
```

    <LAMBDA>

The above function is equivalent to


```nix
x: (y: x + y)
```

    <LAMBDA>

It takes one argument and returns a function `y: x + y` with `x` set to the value of the argument.

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

#### Default attributes

Also known as “default arguments”.

Destructured arguments can have default values for attributes.

This is denoted by separating the attribute name and its default value with a question mark (`?`).

Attributes in the argument are not required if they have a default value.

Example:

```nix
let
  f = {a, b ? 0}: a + b;
in
f { a = 1; }
```

    1

Example:

```nix
let
  f = {a ? 0, b ? 0}: a + b;
in
f { } # empty attribute set
```

    0

#### Additional attributes

Additional attributes are allowed with an ellipsis (`...`):

    {a, b, ...}: a + b

Unlike the previous counter-example, passing additional arguments will not be an error.

Example:

```nix
let
  f = {a, b, ...}: a + b;
in
f { a = 1; b = 2; c = 3; }
```

    3

### Named attribute set argument

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
  f = {a, b, ...}@args: a + b + args.c;
in
f { a = 1; b = 2; c = 3; }
```

    6

(libraries)=
## Function libraries

In addition to the [built-in operators][operators], there are two widely used libraries that *together* can be considered standard for the Nix language.
You need to know about both to understand and navigate Nix language code.

<!-- TODO: find a place for operators -->

We recommend to at least skim them to familiarise yourself with what is available.

[operators]: https://nixos.org/manual/nix/stable/language/operators.html

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
[nix-builtins]: https://nixos.org/manual/nix/stable/language/builtins.html

### `pkgs.lib`

The [`nixpkgs`][nixpkgs] repository contains an attribute set called [`lib`][nixpkgs-lib], which provides a large number of useful functions.

:::{note}
The Nixpkgs manual lists all [Nixpkgs library functions][nixpkgs-functions].
:::

These functions are usually accessed through `pkgs.lib`.

Example:

    pkgs.lib.strings.toUpper

[nixpkgs-functions]: https://nixos.org/manual/nixpkgs/stable/#sec-functions-library
[nixpkgs-lib]: https://github.com/NixOS/nixpkgs/blob/master/lib/default.nix

(side-effects)=
## Side effects

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

<details><summary>Detailed explanation</summary>

The preceding shell command writes the contents `1 + 2` to the file `file.nix` in the current directory.

The above Nix expression refers to this file as `./file.nix`.
`import` reads the file as a side effect and evaluates to the contained Nix expression.

It is an error if the file system path does not exist.

After reading `file.nix` the Nix expression is equivalent to the file contents:

```nix
1 + 2
```

    3

</details>

Example:

```console
echo "x: x + 1" > file.nix
```

```nix
import ./file.nix 1
```

    2

<details><summary>Detailed explanation</summary>

The preceding shell command writes the contents `x: x + 1` to the file `file.nix` in the current directory.

The above Nix expression refers to this file as `./file.nix`.
`import ./file.nix` reads the file as a side effect and evaluates to the contained Nix expression.

It is an error if the file system path does not exist.

After reading the file, the Nix expression `import ./file.nix` is equivalent to the file contents:

```nix
(x: x + 1) 1
```

    2

This applies the function `x: x + 1` to the argument `1`, and therefore evaluates to `3`.

:::{note}
Parentheses are required to separate function declaration from function application.
:::

</details>

### Build inputs

Build inputs are files that build tasks refer to in their precise description of how to derive new files.

Since Nix language evaluation is otherwise pure, the only way to specify build inputs is explicitly with:

- File system paths
- Dedicated impure functions.

When run, a build task will only have access to explicitly declared build inputs.

:::{important}
Purity is the key to reproducible builds.

It precludes build tasks from referring to files which are not explicitly specified as build inputs.
:::

#### Paths

Whenever a file system path is rendered to a character string with [antiquotation](antiquotation), the contents of that file are copied to a special location in the file system, the *Nix store*, as a side effect.

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

The above Nix expression refers to this file as `./data` and converts the file system path to a string with [antiquotation](antiquotation) `${ ... }`.

Only values that can be represented as a character string are allowed for antiquotation.
A file system path is such a value, and its character string representation is the corresponding Nix store path.

The Nix store path is obtained by taking the hash of the file's contents (`<hash>`) and combining it with the file name (`<name>`).
The file is copied into the Nix store directory `/nix/store` as a side effect of evaluation:

    /nix/store/<hash>-<name>

It is an error if the file system path does not exist.

</details>


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
The Nixpkgs manual on [Fetchers][nixpkgs-fetchers] lists numerous additional library functions to fetch files over the network.
:::

It is an error if the network request fails.

[fetchurl]: https://nixos.org/manual/nix/stable/language/builtins.html#builtins-fetchurl
[fetchTarball]: https://nixos.org/manual/nix/stable/language/builtins.html#builtins-fetchTarball
[fetchGit]: https://nixos.org/manual/nix/stable/language/builtins.html#builtins-fetchGit
[fetchClosure]: https://nixos.org/manual/nix/stable/language/builtins.html#builtins-fetchClosure
[nixpkgs-fetchers]: https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers

(build-tasks)=
### Build tasks

A build task in Nix is called *derivation*.

Build tasks are at the core of both Nix and the Nix language:
- The Nix language is used to produce build tasks.
- Nix runs build tasks to produce *build results*.
- Build results can in turn be used as inputs for other build tasks.

The Nix language primitive to declare a build task is the built-in impure function `derivation`.

It is usually wrapped by the Nixpkgs build mechanism `stdenv.mkDerivation`, which hides much of the complexity involved in non-trivial build procedures.

:::{note}
You will probably never encounter `derivation` in practice.
:::

Whenever you see `mkDerivation`, it denotes something that Nix will eventually *build*.

Example: [a package using `mkDerivation`](mkDerivation-example)

The evaluation result of `derivation` (and `mkDerivation`) has the special Nix language data type Derivation.
It behaves like an [attribute set](attrset), except that it can be used in [antiquotation](antiquotation).

Example:

```nix
let
  pkgs = import <nixpkgs> {};
in "${pkgs.nix}"
```

    "/nix/store/rbyjapdp614xfd0l2wiji700x5s8dssl-nix-2.10.3"

:::{note}
Your output may differ.
It may produce a different hash or even a different package version.

A derivation's output path is fully determined by its inputs, which in this case come from *some* version of Nixpkgs.

This is why we recommend to [avoid search paths](search-path), except in examples intended for illustration only.
:::

<details><summary>Detailed explanation</summary>

The example imports the Nix expression from the search path `<nixpkgs>`, and applies the resulting function to an empty attribute set `{}`.
Its output is assigned the name `pkgs`.

It cannot be inferred from the code above, but `pkgs` is an attribute set of Derivations.
That is, each of its attributes ultimately boils down to a call to `derivation`.

Converting the attribute `pkgs.nix` to a string with [antiquotation](antiquotation) is allowed, as `pkgs.nix` is a Derivation.
The resulting string is the file system path where the build result of that derivation will end up.

</details>

Antiquotation on Derivation values is used to refer to other build results as file system paths when declaring new build tasks.

This allows constructing arbitrarily complex compositions of derivations with the Nix language.

:::{important}
Nix and the Nix language distinguish the following concepts which have similar names:

- derivation

  A build task in Nix.
  This is an abstract concept embodied by the following representations.

- `derivation`

  A built-in function in the Nix language.
  It evaluates to a *Derivation* within the Nix language and produces a *store derivation* in the Nix store as a side effect.

  The process of creating a store derivation is called *instantiation*.

- Derivation

  A data type in the Nix language.
  It is like an [attribute set](attrset) and can be used in [antiquotation](antiquotation).

  The character string representation of a Derivation is the Nix store path of its build result.
  This Nix store path will contain the build result when the derivation is built.

- store derivation

  A `.drv` file in the Nix store.
  It describes a build task, and is produced as a side effect of evaluating `derivation`.

  The Nix store path of a store derivation is different from the path of the derivation's build result.
  The store derivation is only the build task for that build result, not the build result itself.
:::

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
- The indented string contains an antiquotation, which will expand the value of `message` to yield `"hello world"`.


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

(mkDerivation-example)=
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

This example is a (simplified) package declaration from Nixpkgs.

Explanation:

- This expression is a function that takes an attribute set which must have exactly the attributes `lib` and `stdenv`.
- It returns the result of evaluating the function `mkDerivaion`, which is an attribute of `stdenv`, applied to a recursive set.
- The recursive set passed to `mkDerivation` uses its own `pname` and `version` attributes in the argument to the built-in function `fetchTarball`.
- The `meta` attribute is itself an attribute set, where the `license` attribute has the value that was assigned to the nested attribute `lib.licenses.gpl3Plus`.

## References

- [Nix manual: Nix language][manual-language] - Nix language reference
- [Nix manual: Built-in Functions][nix-builtins] - Nix language built-in functions
- [Nixpkgs manual: Functions reference][nixpkgs-functions] - Nixpkgs function library
- [Nixpkgs manual: Fetchers][nixpkgs-fetchers] - Nixpkgs fetcher library

## Next steps

To get things done:

- [](declarative-reproducible-envs) – create reproducible shell environments from a Nix file
- [Garbage Collection](https://nixos.org/manual/nix/stable/package-management/garbage-collection.html) – remove unused build results from the Nix store

To learn more:

If you worked through the examples, you will have noticed that reading the Nix language reveals the structure of the code, but does not necessarily tell what the code actually means.

Often it is not possible to determine from the code at hand
- the data type of a named value or function argument.
- the data type a called function accepts for its argument.
- which attributes are present in a given attribute set.

Example:

```nix
{ x, y, z }: (x y) z.a
```

How do we know...
- that `x` will be a function that, given an argument, returns a function?
- that, given `x` is a function, `y` will be an appropriate argument to `x`?
- that, given `(x y)` is a function, `z.a` will be an appropriate argument to `(x y)`?
- that `z` will be an attribute set at all?
- that, given `z` is an attribute set, it will have an attribute `a`?
- which data type `y` and `z.a` will be?
- the data type of the end result?

And how does the caller of this function know that it requires an attribute set with attributes `x`, `y`, `z`?

Answering such questions requires knowing the context in which a given expression is supposed to be used.

The Nix ecosystem and code style is driven by conventions.
Most names you will encounter in Nix language code come from Nixpkgs:

- [Nix Pills][nix-pills] - a detailed explanation of derivations and how the Nix package collection is constructed from first principles

Nixpkgs provides generic build mechanisms that are widely used:

- [`stdenv`][stdenv] - most importantly `mkDerivation`
- [Trivial Builders][trivial-builders] - to create files and shell scripts

Packages from Nixpkgs can be modified through multiple mechanisms:

- [overrides] – specifically `override` and `overrideAttrs` to modify single packages
- [overlays] – to produce a custom variant of Nixpkgs with individually modified packages

Different language ecosystems and frameworks have different requirements to accommodating them into Nixpkgs:

- [Languages and frameworks][language-support] lists tools provided by Nixpkgs to build language- or framework-specific packages with Nix.

The NixOS Linux distribution has a modular configuration system that imposes its own conventions:

- [NixOS modules][nixos-modules] shows how NixOS configurations are organized.

[nix-pills]: https://nixos.org/guides/nix-pills/
[stdenv]: https://nixos.org/manual/nixpkgs/stable/#chap-stdenv
[trivial-builders]: https://nixos.org/manual/nixpkgs/stable/#chap-trivial-builders
[overlays]: https://nixos.org/manual/nixpkgs/stable/#chap-overlays
[overrides]: https://nixos.org/manual/nixpkgs/stable/#chap-overrides
[language-support]: https://nixos.org/manual/nixpkgs/stable/#chap-language-support
[nixos-modules]: https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules

