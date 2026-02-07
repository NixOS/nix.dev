from sphinx.transforms.post_transforms import SphinxPostTransform
from typing import Any
from docutils import nodes as docutil_nodes
from sphinx import addnodes as sphinx_nodes
from pydata_sphinx_theme.utils import get_theme_options_dict
from .nodes import SideNoteNode
from ._compat import findall


class HandleFootnoteTransform(SphinxPostTransform):
    """Transform footnotes into side/marginnotes."""

    default_priority = 1
    formats = ("html",)

    def run(self, **kwargs: Any) -> None:
        theme_options = get_theme_options_dict(self.app)
        if theme_options.get("use_sidenotes", False) is False:
            return None
        # Cycle through footnote references, and move their content next to the
        # reference. This lets us display the reference in the margin,
        # or just below on narrow screens.
        for ref_node in findall(self.document, docutil_nodes.footnote_reference):
            parent = None
            # Each footnote reference should have a single node it points to via `ids`
            for foot_node in findall(self.document, docutil_nodes.footnote):
                # matching the footnote reference with footnote
                if (
                    len(foot_node.attributes["backrefs"])
                    and foot_node.attributes["backrefs"][0]
                    == ref_node.attributes["ids"][0]
                ):
                    parent = foot_node.parent
                    # second children of footnote node is the content text
                    foot_node_content = foot_node.children[1].children

                    sidenote = SideNoteNode()
                    para = docutil_nodes.inline()
                    # first children of footnote node is the label
                    label = foot_node.children[0].astext()

                    if foot_node_content[0].astext().startswith("{-}"):
                        # marginnotes will have content starting with {-}
                        # remove the number so it doesn't show
                        para.attributes["classes"].append("marginnote")
                        foot_node_content[0] = docutil_nodes.Text(
                            foot_node_content[0].replace("{-}", "")
                        )
                        para.children = foot_node_content

                        sidenote.attributes["names"].append(f"marginnote-role-{label}")
                    else:
                        # sidenotes are the default behavior if no {-}
                        # in this case we keep the number
                        superscript = docutil_nodes.superscript("", label)
                        para.attributes["classes"].append("sidenote")
                        parachildren = [superscript] + foot_node_content
                        para.children = parachildren

                        sidenote.attributes["names"].append(f"sidenote-role-{label}")
                        sidenote.append(superscript)

                    # If the reference is nested (e.g. in an admonition), duplicate
                    # the content node And place it just before the parent container,
                    # so it works w/ margin. Only show one or another depending on
                    # screen width.
                    node_parent = ref_node.parent
                    para_dup = para.deepcopy()
                    # looping to check parent node
                    while not isinstance(
                        node_parent, (docutil_nodes.section, sphinx_nodes.document)
                    ):
                        # if parent node is another container
                        if not isinstance(
                            node_parent,
                            (docutil_nodes.paragraph, docutil_nodes.footnote),
                        ):
                            node_parent.replace_self([para, node_parent])
                            para_dup.attributes["classes"].append("d-n")
                            break
                        node_parent = node_parent.parent

                    ref_node.replace_self([sidenote, para_dup])
                    break
            if parent:
                parent.remove(foot_node)
