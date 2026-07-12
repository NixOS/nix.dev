---
layout: "../layouts/Page.astro"
title: "Markdown Style Guide 5*6 affine fjord"
---

# Headings

The following HTML `<h1>` to `<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.

# H1

## H2

### H3

#### H4

##### H5

###### H6

# Paragraph

Xerum, quo qui aut unt [expliquam]() qui dolut labo. Aque [venitatiusda]() cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem.

Illegal nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

# Images

## Syntax

```markdown
![Alt text](../assets/nixos-logo.svg)
```

## Output

![Alt text](../assets/nixos-logo.svg)

# Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

## Blockquote without attribution

### Syntax

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use _Markdown syntax_ within a blockquote.
```

### Output

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use _Markdown syntax_ within a blockquote.

## Blockquote with attribution

### Syntax

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

### Output

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

# Tables

## Syntax

```markdown
| Normal           | Italics             | Bold               | Code             |
|:-----------------|:--------------------|:-------------------|:-----------------|
| normal           | _italics_           | **bold**           | `code`           |
| more normal      | _more italics_      | **more bold**      | `more code`      |
| even more normal | _even more italics_ | **even more bold** | `even more code` |
```

## Output

| Normal           | Italics             | Bold               | Code             |
|:-----------------|:--------------------|:-------------------|:-----------------|
| Normal           | _Italics_           | **Bold**           | `Code`           |
| More normal      | _More italics_      | **More bold**      | `More code`      |
| Even more normal | _Even more italics_ | **Even more bold** | `Even more code` |

# Code Blocks

## Syntax

we can use 3 backticks ``` in new line and write snippet and close with 3 backticks on new line and to highlight language specific syntax, write one word of language name after first 3 backticks, for eg. html, javascript, css, markdown, typescript, txt, bash

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

## Output

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## Ligatures test

```
-<< -< -<- <-- <--- <<- <- -> ->> --> ---> ->- >- >>-

=<< =< =<= <== <=== <<= <= => =>> ==> ===> =>= >= >>=

<-> <--> <---> <----> <=> <==> <===> <====> :: ::: __

<~~ </ </> /> ~~> == != /= ~= <> === !== !=== =/= =!=

<: := *= *+ <* <*> *> <| <|> |> <. <.> .> +* =* =: :>

(* *) /* */ [| |] {| |} ++ +++ \/ /\ |- -| <!-- <!---
```

## Nix test

```nix title="package.nix"
{
  lib,
  python3,
  runCommand,
}:

let
  python = python3.override {
    self = python;
    packageOverrides = final: prev: {
      markdown-it-py = prev.markdown-it-py.overridePythonAttrs (_: {
        doCheck = false;
      });
      mdit-py-plugins = prev.mdit-py-plugins.overridePythonAttrs (_: {
        doCheck = false;
      });
    };
  };
in

python.pkgs.buildPythonApplication rec {
  pname = "nixos-render-docs";
  version = "0.0";
  pyproject = true;

  # NOTE this is a CI test rather than a build-time test because we want to keep the
  # build closures small. mypy has an unreasonably large build closure for docs builds.
  passthru.tests.typing =
    runCommand "${pname}-mypy"
      {
        nativeBuildInputs = [
          (python3.withPackages (
            ps: with ps; [
              mypy
              pytest
              markdown-it-py
              mdit-py-plugins
            ]
          ))
        ];
      }
      ''
        mypy --strict ${src}
        touch $out
      '';

  meta = {
    description = "Renderer for NixOS manual and option docs";
    mainProgram = "nixos-render-docs";
    license = lib.licenses.mit;
    maintainers = [ ];
  };
}
```

# List Types

## Ordered List

### Syntax

```markdown
1. First item
2. Second item
3. Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.
4. Third item
```

### Output

1. First item
2. Second item
3. Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.
4. Third item

## Unordered List

### Syntax

```markdown
- List item
- Another item
- And another item
```

### Output

- List item
- Another item
- And another item

## Nested list

### Syntax

```markdown
- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese
```

### Output

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

# Other Elements — abbr, sub, sup, kbd, mark

## Syntax

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
```

## Output

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.


# Asides

## Types

Directives used in nixpkgs:

```nu title="command.nu"
( rg --pcre2 --no-filename --no-heading --only-matching --no-line-number
    `(?<=:::\s?\{\.)\w+`
    **/*.md
  | lines | uniq --count | sort-by count | to md
)
```

| directive | count | new colour | icon
|:--- |:--- |:--- |:---
| danger | — | mahogany | "!" in 🛑
| figure | 1 | — | —
| important | 3 | ? | ?
| tip | 12 | purple | rocket?
| caution | 25 | amber | ⚠️
| warning | 69 | amber | ⚠️
| example | 112 | avocado | ✏️
| note | 172 | blue | ℹ️ (but circle)

questions:
- important?
- caution vs. warning vs. danger?

unused colours:
- sky
- aquamarine
- mullberry

## Test

### Syntax

md directives

```md
:::note
This is a note.

Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::example
This is an example. Lorem Ipsum dolor sit amet.

Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::caution
This is a caution / warning aside. Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow.

The quick brown fox jumps over the lazy dog.
:::

:::danger
This is a danger aside. Lorem Ipsum dolor sit amet.

Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::tip
This is a tip. Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow.

The quick brown fox jumps over the lazy dog.
:::
```

### Output

:::note
This is a note.

Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::example
This is an example. Lorem Ipsum dolor sit amet.

Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::caution
This is a caution / warning aside. Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow.

The quick brown fox jumps over the lazy dog.
:::

:::danger
This is a danger aside. Lorem Ipsum dolor sit amet.

Sphinx of black quartz, judge my vow. The quick brown fox jumps over the lazy dog.
:::

:::tip
This is a tip. Lorem Ipsum dolor sit amet. Sphinx of black quartz, judge my vow.

The quick brown fox jumps over the lazy dog.
:::
