from dataclasses import dataclass
from pathlib import Path

import docutils.nodes as nodes
from docutils.parsers.rst import directives
from sphinx.application import Sphinx
from sphinx.util.docutils import SphinxDirective
import yaml


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
    option_spec = {
        "authors": directives.unchanged,
        "editors": directives.unchanged,
    }

    def run(self) -> list[nodes.Node]:
        field_list = nodes.field_list(classes=["contributors"])
        for option, label in [("authors", "Author"), ("editors", "Editor")]:
            raw = self.options.get(option, "")
            handles = [h.strip() for h in raw.split(",") if h.strip()]
            people = resolve(handles)
            if len(people) > 1:
                label += "s"
            if people:
                field_list += contributors_field(label, people)
        return [field_list] if field_list.children else []


def setup(app: Sphinx) -> dict:
    app.add_directive("contributors", ContributorsDirective)
    return {}
