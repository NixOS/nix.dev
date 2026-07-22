(emit-a-warning-only-once)=
# Emit an evaluation warning only once

The Nix language provides a `warn` function that lets expression authors provide feedback to their code's callers/users.
Since such warnings are tied to the flow of evaluation, it may happen that the warning you wish to add is trigger too many times.
This document shows a technique to solve that problem, and documents its requirements and limitations.

## Working principle

Nix evaluates the root value of an expression file only once.
We will exploit this property to emit fewer warnings.

## Example

Suppose we have the following little library:

```nix
{ lib, pkgs }:

{
  makeWidgetScript = { widgetType, useLegacyMethod ? true }:
    pkgs.writeScriptBin "make-widget" ''
      #!${pkgs.runtimeShell}
      echo "Just made a" ${lib.escapeShellArg widgetType} ${lib.optionalString (!useLegacyMethod) "efficiently"}
    '';
}
```

Since we want widget production to be efficient, we want to phase out `useLegacyMethod`, but without causing unnecessary disruption, so we add a warning:

```nix
{ lib, pkgs }:

{
  makeWidgetScript = args@{ widgetType, useLegacyMethod ? true }:
    lib.warnIf
      (useLegacyMethod &&
        # not explicitly provided by the caller
        !(args ? useLegacyMethod))
      ''
        ACME Inc is in the process of phasing out the legacy widget production method,
        but `makeWidgetScript` is still invoked without disabling the legacy method.
        If this is intentional, and you are not yet ready to upgrade to the efficient method,
        you may specify `useLegacyMethod = true;` to temporarily prolong your use during
        the phase-out.
      ''
      (pkgs.writeScriptBin "make-widget" ''
        #!${pkgs.runtimeShell}
        echo "Just made a" ${lib.escapeShellArg widgetType} ${lib.optionalString (!useLegacyMethod) "efficiently"}
      '');
}
```

This will cause each `makeWidgetScript` invocation to emit a sizable message, every time it is invoked in the old way.

Now let's use a top level scope to reduce our warnings to just one.

We'll start by adding a `let` binding to the top of the file.
The bindings in it will only be evaluated once, as the evaluator will cache the value it leads up to.

```nix
let
  widgetScriptWarning = <...>; # TODO
in
{ lib, pkgs }:

<...> # The rest of the code
```

Unfortunately, this means we don't have access to the `lib.warn` family of functions, but fortunately we can usually rely on `builtins.warn` nowadays (more on that later).

Now we can start writing the warning in the `let` binding, although we have nothing to return.
We could simply omit the second argument, but then we'd be defining a helper function that behaves just like before.
Instead, we'll pass `null` for the value.

<!-- the comment may seem redundant for instructional purposes, but makes for good copy-pasting -->
```nix
# this let must be top-level; see https://nix.dev/guides/recipes/emit-a-warning-only-once
let
  inherit (builtins) warn;
  widgetScriptWarning = warn ''
    ACME Inc is in the process of phasing out the legacy widget production method,
    but `makeWidgetScript` is still invoked without disabling the legacy method.
    If this is intentional, and you are not yet ready to upgrade to the efficient method,
    you may specify `useLegacyMethod = true;` to temporarily prolong your use during
    the phase-out.
  '' null; # Note the `null` here
in
{ lib, pkgs }:

<...> # The rest of the code
```

Now we have a binding that triggers at most once, but we haven't triggered it yet.
This is where `builtins.seq` comes in. It causes its first argument to be evaluated, but only returns its second argument.

Let's see the whole example:

<!-- the comment may seem redundant for instructional purposes, but makes for good copy-pasting -->
```nix
# this let must be top-level; see https://nix.dev/guides/recipes/emit-a-warning-only-once
let
  inherit (builtins) warn seq;
  widgetScriptWarning = warn ''
    ACME Inc is in the process of phasing out the legacy widget production method,
    but `makeWidgetScript` is still invoked without disabling the legacy method.
    If this is intentional, and you are not yet ready to upgrade to the efficient method,
    you may specify `useLegacyMethod = true;` to temporarily prolong your use during
    the phase-out.
  '' null; # Note the `null` here
in
{ lib, pkgs }:

{
  makeWidgetScript = args@{ widgetType, useLegacyMethod ? true }:
    (if useLegacyMethod &&
        # not explicitly provided by the caller
        !(args ? useLegacyMethod)
      then seq widgetScriptWarning
      else x: x
    )
    pkgs.writeScriptBin "make-widget" ''
      #!${pkgs.runtimeShell}
      echo "Just made a" ${lib.escapeShellArg widgetType} ${lib.optionalString (!useLegacyMethod) "efficiently"}
    '';
}
```

## Best of both worlds

You may combine both techniques to reduce, but not eliminate duplication.
Use the described technique to provide context in a single warning, and then trigger it right before a brief warning.
This lets you provide context about the call sites without polluting the log as much.

Here is how you may trigger a context warning:

<!-- just the triggering snippet for brevity; we already have plenty of duplicate-ish code -->
```nix
    lib.warnIf
      (useLegacyMethod &&
        # not explicitly provided by the caller
        !(args ? useLegacyMethod))
      (seq widgetScriptWarning "Implicit use of legacy method for widget ${widgetType}; see prior warning.")
      pkgs.writeScriptBin # ...
```

Note that we use `warnIf` again, and the warning message provides a good opportunity for `seq` to trigger our contextual warning.

## Finding call sites

If the evaluator does not produce an unrelated warning first, a quick method to find a call site is to pass `--show-trace --abort-on-warn` to your Nix command invocation.
Otherwise, `--debugger-on-warn` is more suitable, as it lets you resume evaluation after warnings you ignore.

## `builtins.warn` availability

`builtins.warn` was introduced in Nix 2.23.
Most users have upgraded far beyond 2.22, but if your code is in the upgrade path for users who may not have, use this polyfill:

```nix
let
  warn = builtins.warn or builtins.trace;
  # ...
in
# ...
```

The `. or` operator will take care of the potentially missing `warn`.

When applying this pattern in Nixpkgs, please use this polyfill.

(broader-application)=
## Broader application, e.g. NixOS

This technique of `let` + `warn` + `seq` could also be applied in places where the `let` isn't truly top level in a file.
Instead, the warning could be attached to something else that is quite central and low in number, such as the "top level" of a NixOS configuration.
You could create an internal option whose value emits the message once, but this technique is largely unnecessary as NixOS's own [`warnings` option] provides plenty of control.

(limitations)=
## Limitations

Nix will only cache a value or let binding when it's the same file, and it will only do so within a single evaluator process.
Technically it's not "once", but at most once _per version of the file_, _per evaluator invocation_.

## Troubleshooting

### It didn't print at all

Make sure that
- `warn` is called with two arguments
- the `seq` trigger will be reached.

### It printed more than once

Make sure that the binding for the warning contains the whole `warn` invocation with *both* arguments: the message and `null`.

Alternatively, this may be unavoidable; see [Limitations](#limitations).

## See also

- [`builtins.warn`](https://nix.dev/manual/nix/stable/language/builtins#builtins-warn)
- [`builtins.seq`](https://nix.dev/manual/nix/stable/language/builtins#builtins-seq)
- [`builtins.trace`](https://nix.dev/manual/nix/stable/language/builtins#builtins-trace)
- [NixOS `warnings` option][`warnings` option]

[`warnings` option]: https://nixos.org/manual/nixos/stable/#sec-assertions
