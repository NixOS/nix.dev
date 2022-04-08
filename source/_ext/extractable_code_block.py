from docutils import nodes
from docutils.nodes import Node
from docutils.parsers.rst import Directive
from docutils.parsers.rst import directives
from sphinx.directives import optional_int
from sphinx.directives.code import CodeBlock
from sphinx.util import logging
from sphinx.util.typing import OptionSpec
from typing import List

import os
import stat

logger = logging.getLogger(__name__)


class ExtractableCodeBlock(CodeBlock):
    """A custom directive to extract code blocks into files.

    We want our code samples to be tested in CI. This class overrides the
    default `code-block` to allow passing a second argument: the filename
    to extract the code block to.

    Out-of-the-box Sphinx behaviour:

    ```python
    foo = "bar"
    ```

    Additional extraction of a code block in `mydoc.md` file into
    `./extracted/mydoc/foo.py` file:

    ```python foo.py
    foo = "bar"
    ```
    """

    EXTRACT_DIR = "extracted"
    optional_arguments = 2

    def run(self) -> List[Node]:
        # This is out-of-the-box usage of code-blocks, with a single
        # argument: the programming language
        # Don't do any extraction
        if len(self.arguments) < 2:
            return super(ExtractableCodeBlock, self).run()

        location = self.state_machine.get_source_and_line(self.lineno)

        path = os.path.join(
            # top-level dir containing extracted code blocks
            self.EXTRACT_DIR,
            # subdir containing extracted code blocks from a single .md file
            os.path.splitext(os.path.basename(self.state.document.current_source))[0],
            # file name of the extracted code block
            self.arguments[1],
        )
        logger.info(
            f"Extracting code block into {path}",
            location=location,
        )
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(self.block_text)

        # make scripts executable
        if path.endswith(".sh") or path.endswith(".py"):
            st = os.stat(path)
            os.chmod(path, st.st_mode | stat.S_IEXEC)

        return super(ExtractableCodeBlock, self).run()


def setup(app):
    app.add_directive("code-block", ExtractableCodeBlock, override=True)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
