(thunks)=
# Thunks

In Nix, _thunks_ are used to implement laziness.
A thunk is a type of Nix value that is not yet evaluated.
It is only evaluated once needed.
It consists of two parts:
- The expression that the value should be evaluated from
- The variables the expression has access to

It is very easy to introduce a lot of thunks in Nix code, which can have negative consequences:

- Every new thunk requires heap memory allocations.
- A thunk prevents the evaluation garbage collector from collecting any variables it needs,
  causing not only the memory of the thunk itself to be kept alive, but also all its references.
- Too deeply nested thunks can lead to stack overflows when evaluated.

Of course, thunks are essential to Nix, so it's not possible to avoid them.
And in fact, using thunks properly can improve performance.

## When thunks are created

The rules of thunk creation in Nix are relatively straightforward.

1. Nix won't create thunks for atomic expressions

   - This includes integers, floats, strings, paths, booleans and null
   - This means that when you see e.g. "hello" or true in Nix, you know that Nix won't allocate a thunk for that. The reason for this is that there's not much to evaluate there, putting it into a thunk wouldn't make much sense.
   - Note however that this is not the case for "Hello ${name}", because that is desugared to "Hello " + name underneath, which won't be a string by itself anymore

2. Nix won't create thunks for referenced variables

   - This means that once you defined a variable in a let in expression, or you're in a function that received some arguments at the top, Nix won't create extra thunks for when you reference these variables.
   - It makes a lot of sense for Nix to do this, because variables themselves already point to either a thunk or an evaluated value, which can be used directly and doesn't need to be wrapped in another thunk that would just say "Evaluate this variable".

3. The following expressions attempt to create thunks if allowed by above two rules

   - `let ... in` expressions attempt to create a thunk for each variable
   - `{ ... }` (attribute set) expressions attempt to create a thunk for each attribute
   - `[ ... ]` (list) expressions attempt to create a thunk for each element
   - `f a` (function application) expressions attempt to create a thunk for the argument
   - `{ attr ? def }: ...`:
     For every function evaluation where the function takes an attribute set where an attribute has a default value which doesn't exist in the passed argument,
     a thunk for the default value is attempted to be created.

## Example

The following shows an illustrative example of when and how many thunks are allocated.
The comments give the thunk counts and explanation in the format

```nix
# total (+difference) Explanation
```

```nix
# let in expressions can allocate thunks
let

  # 0 (+0) No thunk allocated because strings are atomic value expressions
  name = "Paul";

  # 1 (+1) Thunk is allocated, because the + operator is neither an atomic
  # value nor a direct variable
  greeting = "Hello, " + name;

  # 1 (+0) No thunk is allocated because greeting is a direct variable
  result1 = greeting;

  # 2 (+1) This let in variable creates a new thunk, but the attribute itself
  # isn't evaluated, meaning it also won't create any thunks for its values
  deadAttrs = {
    deadName = "dead " + "value";
  };

  # 4 (+2) One for the variable, but also one for the value inside, because the
  # attribute itself is evaluated
  attrs = {
    name = "alive " + "value";
  };

  # 5 (+1) Intermediate result, forcing evaluation of the attrs, one thunk for
  # the variable declaration. Note that this is a function call, but because
  # both arguments are variables, no extra thunks are allocated
  result2 = builtins.seq attrs null;

  # 7 (+2) Same with a list which is evaluated
  list = [
    ("alive " + "value")
  ];

  # 8 (+1) And again, another intemediate result
  result3 = builtins.seq list result2;

  # 10 (+2) Just two variables, a normal function doesn't allocate a thunk on
  # its own
  fun = a: a;
  result4 = builtins.seq fun result3;

  # 13 (+3) However if the function is applied to a non-atom, non-variable
  # value, a thunk for the argument is created
  app = fun (1 + 1);
  result5 = builtins.seq app result4;

  # 16 (+3) A function with a default attribute argument can allocate a thunk
  # for the default argument if it isn't passed
  attrApp = ({ notPassed ? 1 + 1, ... }: null) attrs;
  result6 = builtins.seq attrApp result5;


  # Let bindings can allocate thunks even if their variables are unused
  #  -> Push let bindings outside as much as possible!
  # 16 (+2) Outer let bindings
  # 19 (+3) inner let bindings, one for every iteration
  # 23 (+2) for the two non-atomic/non-variable function argument
  # 23 (+0) Atomic value list elements
  lets = map (x:
    let y = 1 + 1;
    in x
  ) [ 1 2 3 ];
  result7 = builtins.deepSeq lets result6;

  # 24 (+1) One variable
  values = [ 1 2 3 ];

  # 27 (+3) Three variables next
  # 27 (+0) Function receives variable as argument -> no extra thunk
  elAt = builtins.elemAt values;
  # 27 (+0) Function called three times, but all arguments don't need thunks
  elAtApp = elAt 0 + elAt 1 + elAt 2;
  result8 = builtins.seq elAtApp result7;

  # 29 (+2) Two variables next
  # 29 (+0) Function (and nested function) called three times,
  # but all arguments don't need thunks
  elemAtApp = builtins.elemAt values 0
    + builtins.elemAt values 1
    + builtins.elemAt values 2;
  result9 = builtins.seq elemAtApp result8;

in result9
```

We can verify the final thunk count by using the [`NIX_SHOW_STATS`](https://nixos.org/manual/nix/stable/command-ref/env-common.html?highlight=NIX_SHOW_STATS#env-NIX_SHOW_STATS) environment variable.

```shell-session
$ NIX_SHOW_STATS=1 NIX_SHOW_STATS_PATH=stats.json \
  nix-instantiate --eval thunks.nix
null
$ jq .nrThunks stats.json
29
```
