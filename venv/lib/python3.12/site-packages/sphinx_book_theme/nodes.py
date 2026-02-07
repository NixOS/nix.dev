from docutils import nodes
from sphinx.application import Sphinx
from typing import Any, cast


class SideNoteNode(nodes.Element):
    """Handles rendering of side/marginnote content text for html outputs.
    Inserts required html to handle both desktop and mobile."""

    def __init__(self, rawsource="", *children, **attributes):
        super().__init__("", **attributes)

    @classmethod
    def add_node(cls, app: Sphinx) -> None:
        add_node = cast(Any, app.add_node)  # has the wrong typing for sphinx<4
        add_node(cls, override=True, html=(visit_SideNoteNode, depart_SideNoteNode))


def visit_SideNoteNode(self, node):
    tagid = node.attributes["names"][0]
    if "marginnote" in tagid:
        self.body.append(
            f"<label for='{tagid}' class='margin-toggle marginnote-label'>"
        )
    else:
        self.body.append(f"<label for='{tagid}' class='margin-toggle'>")
        self.body.append(self.starttag(node, "span"))


def depart_SideNoteNode(self, node):
    tagid = node.attributes["names"][0]
    if "sidenote" in tagid:
        self.body.append("</span>\n\n")
    self.body.append("</label>")
    self.body.append(
        f"<input type='checkbox' id='{tagid}' name='{tagid}' class='margin-toggle'>"
    )
