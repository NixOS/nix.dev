# Nix language primer


  $ nix repl 
> "" + 3
error: cannot coerce an integer to a string

       at «string»:1:6:

            1| "" + 3
             |      ^
            2|

> :doc builtins.any
Synopsis: builtins.any pred list

    Return true if the function pred returns true for at least one element of list, and false otherwise.

# Strings

multiline string + caveats

# Numbers

> 123
123

> 123.3
123.3

> 3.14 + 5
8.14

> toString 5
"5"

# Conditionals

> > if true then 1 else 2
1


# Paths

> :t /foo
a path

Paths can not have a trailing slash:

> /foo/
error: path '/foo/' has a trailing slash

To concatenate paths use the plus operator:

> /foo + /bar
/foo/bar

> "" + /tmp/tumbler-X1YR6J1.png
"/nix/store/b5r3j267vjwq5fss7k75gvp1q5fa0s3h-tumbler-X1YR6J1.png"


TODO: directory functions

# Lists

Lists can contain elements of any type:

  > [1 2 3 "foobar"]
  [ 1 2 3 "foobar" ]

It's important to put any kind of expression inside the list in parenthesis, since there are no commas:

  > [ (1 + 1) 3 ]
  [ 2 3 ]

To append two lists:

  > [ 1 ] ++ [ 2 ]
  [ 1 2 ]

To get the first item in a list:

  > [ 1 2 3 ]
  1

To get the rest of the list:

  > [ 1 2 3 ]
  [ 2 3 ]

To check if an element is in a list:

  > builtins.elem 1 [ 1 2 3 ]
  true

To map over a list of values:

  > builtins.map (x: x * 2) [ 1 2 3 ]
  [ 2 4 6 ]


# Sets



  let
    a = { foo = ""; bar = ""; };
    inherit (foo) a; 
  in foo

Sets merging

# Functions


> (number: number + number)  
«lambda @ (string):1:2»

> (number: number + number) 2
4

> (_: 3) 2


{ x, y ? "foo", z ? "bar" }: z + y + x

{ x, y ? "foo", z ? "bar }@args: args.z + args.y + args.x

TODO: ellipsis + args

# Errors

nix-repl> builtins.tryEval (abort "")
error: evaluation aborted with the following error message: ''

nix-repl> builtins.tryEval (throw "") 
{ success = false; value = false; }

assert true; 1


https://nixcloud.io/tour/?id=1
https://ebzzry.io/en/nix/#nix
https://learnxinyminutes.com/docs/nix/
https://nixos.wiki/wiki/Nix_Expression_Language
https://medium.com/@MrJamesFisher/nix-by-example-a0063a1a4c55
http://www.mstone.info/posts/nix-tutorial/
http://www.binaryphile.com/nix/2018/07/22/nix-language-primer.html
