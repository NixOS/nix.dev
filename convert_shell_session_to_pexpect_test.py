#!/usr/bin/env python


# Debug tips:
# to debug commands, you can use shell.interact() to drop into the shell
# and see what is going on

import sys
from dataclasses import dataclass
from dataclasses import field
import pexpect
import re
import typing as t
import os

# Either, or:
#   $
#   [nix-shell:/some/path]$
prompt = re.compile("^  (\[nix-shell:.*\])?\$ ")


@dataclass
class Block:
    """Shell sessions are constructed of blocks. Each block has a
    line of command followed by one or more lines of output."""

    command: t.Optional[str] = None
    output: t.List[str] = field(default_factory=lambda: [])
    debug: bool = False


blocks = []
new_block = Block()

filename = sys.argv[1]
with open(filename, "r") as file:

    for line in file.readlines():
        if prompt.match(line):
            new_block.command = re.sub(prompt, "", line).strip()
        elif line.startswith("  "):
            new_block.output.append(line.strip())
        else:
            blocks.append(new_block)
            new_block = Block()
    blocks.append(new_block)

shell = pexpect.spawn("nix-shell shell-darwin.nix")
dir_ = os.path.dirname(filename)
shell.sendline(f"cd {dir_}")
for block in blocks:
    shell.sendline(block.command)
    if "DEBUG" in block.output:
        shell.interact()

    shell.expect("\n".join(block.output).replace("...", ".*"))
