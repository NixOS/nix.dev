from docutils.nodes import Element
from collections.abc import Iterator


def findall(node: Element, *args, **kwargs) -> Iterator[Element]:
    # findall replaces traverse in docutils v0.18
    # note a difference is that findall is an iterator
    impl = getattr(node, "findall", node.traverse)
    return iter(impl(*args, **kwargs))
