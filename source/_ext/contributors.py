from dataclasses import dataclass
import enum
from pathlib import Path
from typing import NamedTuple

import docutils.nodes as nodes
from docutils.parsers.rst import directives
from sphinx.application import Sphinx
from sphinx.environment import BuildEnvironment
from sphinx.util.docutils import SphinxDirective
import yaml

Handle = str
Docname = str


class Role(enum.Enum):
    author = "authors"
    editor = "editors"


class ArticleCredit(NamedTuple):
    role: Role
    docname: Docname


ContributorRoles = dict[Handle, list[ArticleCredit]]


@dataclass
class Contributor:
    github: str
    name: str | None = None

    @classmethod
    def from_dict(cls, handle, data):
        if not data:
            # a contributor may be only known by handle and nothing else
            data = {}
        return cls(github=handle, name=data.get("name"))

    def as_reference(self) -> list[nodes.Node]:
        ref = nodes.reference(
            "", f"@{self.github}", refuri=f"https://github.com/{self.github}"
        )
        if self.name:
            return [nodes.Text(f"{self.name} "), ref]
        return [ref]


# FIXME(@fricklerhandwerk): Get up-to-date contributor information from Nixpkgs' `maintainers.nix`
with open(Path(__file__).parent.parent / "contributors.yaml") as f:
    _registry = {
        handle: Contributor.from_dict(handle, data)
        for handle, data in (yaml.safe_load(f) or {}).items()
    }


def resolve(handles: list[str]) -> list[Contributor]:
    result = []
    for handle in handles:
        if handle not in _registry:
            raise ValueError(f"unknown contributor '{handle}'")
        result.append(_registry[handle])
    return result


def contributors_field(label: str, people: list[Contributor]) -> nodes.field:
    para = nodes.paragraph()
    first, *rest = [p.as_reference() for p in people]
    para += first
    for ref in rest:
        para += nodes.Text(", ")
        para += ref
    return nodes.field("", nodes.field_name("", label), nodes.field_body("", para))


class ContributorsDirective(SphinxDirective):
    option_spec = {role.value: directives.unchanged for role in Role}

    def run(self) -> list[nodes.Node]:
        if not hasattr(self.env, "contributors_data"):
            self.env.contributors_data = {}

        field_list = nodes.field_list(classes=["contributors"])
        for role, label in [(Role.author, "Author"), (Role.editor, "Editor")]:
            raw = self.options.get(role.value, "")
            handles = [h.strip() for h in raw.split(",") if h.strip()]
            people = resolve(handles)
            if len(people) > 1:
                label += "s"
            if people:
                field_list += contributors_field(label, people)

            # record the contributor's role on the current document
            for handle in handles:
                self.env.contributors_data.setdefault(handle, []).append(
                    ArticleCredit(role, self.env.docname)
                )

        return [field_list] if field_list.children else []


def position_in_toc(env: BuildEnvironment) -> dict[str, int]:
    """
    Annotate items in the table of contents with their depth-first linearisation order
    """
    order = {}
    stack = [env.config.root_doc]
    while stack:
        docname = stack.pop()
        if docname in order:
            continue
        order[docname] = len(order)
        stack.extend(reversed(env.toctree_includes.get(docname, [])))
    return order


class ContributorsIndex(nodes.General, nodes.Element):
    def render(
        self, app: Sphinx, fromdocname: Docname, data: ContributorRoles
    ) -> nodes.definition_list:
        env = app.builder.env
        toc_position = position_in_toc(env)
        dl = nodes.definition_list()
        for handle in sorted(
            (h for h in _registry if data.get(h)),
            key=lambda h: -len(data[h]),
        ):
            entries = data[handle]
            item = nodes.definition_list_item()
            dt = nodes.term()
            dt += _registry[handle].as_reference()
            item += dt
            dd = nodes.definition()
            field_list = nodes.field_list()
            for role, label in [(Role.author, "Author"), (Role.editor, "Editor")]:
                # sort by order of occurrence
                docs = sorted(
                    (doc for r, doc in entries if r == role),
                    key=lambda d: toc_position.get(d, float("inf")),
                )
                if not docs:
                    continue
                p = nodes.paragraph()
                for i, docname in enumerate(docs):
                    if i > 0:
                        p += nodes.Text(", ")
                    title = env.titles.get(docname)
                    uri = app.builder.get_relative_uri(fromdocname, docname)
                    p += nodes.reference(
                        "",
                        title.astext() if title else docname,
                        internal=True,
                        refuri=uri,
                    )
                field_list += nodes.field(
                    "", nodes.field_name("", label), nodes.field_body("", p)
                )
            dd += field_list
            item += dd
            dl += item
        return dl


class ContributorsIndexDirective(SphinxDirective):
    def run(self) -> list[nodes.Node]:
        return [ContributorsIndex()]


def process_contributors_index(
    app: Sphinx, doctree: nodes.document, fromdocname: str
) -> None:
    env = app.builder.env
    contributors = getattr(env, "contributors_data", {})
    for node in doctree.findall(ContributorsIndex):
        node.replace_self([node.render(app, fromdocname, contributors)])


def setup(app: Sphinx) -> dict:
    app.add_directive("contributors", ContributorsDirective)
    app.add_directive("contributors-index", ContributorsIndexDirective)
    app.add_node(ContributorsIndex)
    app.connect("doctree-resolved", process_contributors_index)
    return {}
