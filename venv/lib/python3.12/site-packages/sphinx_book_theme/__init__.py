"""A lightweight book theme based on the pydata sphinx theme."""

import hashlib
import os
from pathlib import Path
from functools import lru_cache

from docutils import nodes as docutil_nodes
from sphinx.application import Sphinx
from sphinx.locale import get_translation
from sphinx.util import logging
from pydata_sphinx_theme.utils import get_theme_options_dict

from .directives import Margin
from .nodes import SideNoteNode
from .header_buttons import (
    prep_header_buttons,
    add_header_buttons,
    update_sourcename,
    update_context_with_repository_info,
)
from .header_buttons.launch import add_launch_buttons
from .header_buttons.source import add_source_buttons
from ._compat import findall
from ._transforms import HandleFootnoteTransform

__version__ = "1.1.4"
"""sphinx-book-theme version"""

SPHINX_LOGGER = logging.getLogger(__name__)
DEFAULT_LOG_TYPE = "sphinxbooktheme"
MESSAGE_CATALOG_NAME = "booktheme"


def get_html_theme_path():
    """Return list of HTML theme paths."""
    parent = Path(__file__).parent.resolve()
    theme_path = parent / "theme" / "sphinx_book_theme"
    return theme_path


def add_metadata_to_page(app, pagename, templatename, context, doctree):
    """Adds some metadata about the page that we reuse later."""
    # Add the site title to our context so it can be inserted into the navbar
    if not context.get("root_doc"):
        # TODO: Sphinx renamed master to root in 4.x, deprecate when we drop 3.x
        context["root_doc"] = context.get("master_doc")
    context["root_title"] = app.env.titles[context["root_doc"]].astext()

    # Update the page title because HTML makes it into the page title occasionally
    if pagename in app.env.titles:
        title = app.env.titles[pagename]
        context["pagetitle"] = title.astext()

    # Add a shortened page text to the context using the sections text
    if doctree:
        description = ""
        for section in findall(doctree, docutil_nodes.section):
            description += section.astext().replace("\n", " ")
        description = description[:160]
        context["page_description"] = description

    # Add the author if it exists
    if app.config.author != "unknown":
        context["author"] = app.config.author

    # Translations
    translation = get_translation(MESSAGE_CATALOG_NAME)
    context["translate"] = translation

    # If search text hasn't been manually specified, use a shorter one here
    theme_options = get_theme_options_dict(app)
    if "search_bar_text" not in theme_options:
        context["theme_search_bar_text"] = translation("Search") + "..."


@lru_cache(maxsize=None)
def _gen_hash(path: str) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()


def hash_assets_for_files(assets: list, theme_static: Path, context, app):
    """Generate a hash for assets, and append to its entry in context.

    assets: a list of assets to hash, each path should be relative to
         the theme's static folder.

    theme_static: a path to the theme's static folder.

    context: the Sphinx context object where asset links are stored. These are:
        `css_files` and `script_files` keys.
    """
    for asset_path in assets:
        # CSS assets are stored in css_files, JS assets in script_files
        asset_type = "css_files" if asset_path.endswith(".css") else "script_files"
        if asset_type in context:
            # Define paths to the original asset file, and its linked file in Sphinx
            asset_source_path = theme_static / asset_path
            if not asset_source_path.exists():
                SPHINX_LOGGER.warning(
                    f"Asset {asset_source_path} does not exist, not linking."
                )
            # Find this asset in context, and update it to include the digest
            for ii, other_asset in enumerate(context[asset_type]):
                # TODO: eventually the contents of context['css_files'] etc should probably
                #       only be _CascadingStyleSheet etc. For now, assume mixed with strings.
                if getattr(other_asset, "filename", str(other_asset)) != asset_path:
                    continue
                # Take priority from existing asset or use default priority (500)
                priority = getattr(other_asset, "priority", 500)
                # Remove existing asset
                del context[asset_type][ii]
                # Add new asset
                app.add_css_file(
                    asset_path,
                    digest=_gen_hash(asset_source_path),
                    priority=priority,
                )


def hash_html_assets(app, pagename, templatename, context, doctree):
    """Add ?digest={hash} to assets in order to bust cache when changes are made.

    The source files are in `static` while the built HTML is in `_static`.
    """
    assets = ["scripts/sphinx-book-theme.js"]
    # Only append the book theme CSS if it's explicitly this theme. Sub-themes
    # will define their own CSS file, so if a sub-theme is used, this code is
    # run but the book theme CSS file won't be linked in Sphinx.
    if app.config.html_theme == "sphinx_book_theme":
        assets.append("styles/sphinx-book-theme.css")
    hash_assets_for_files(assets, get_html_theme_path() / "static", context, app)


def update_mode_thebe_config(app):
    """Update thebe configuration with SBT-specific values"""
    theme_options = get_theme_options_dict(app)
    if theme_options.get("launch_buttons", {}).get("thebe") is True:
        # In case somebody specifies they want thebe in a launch button
        # but has not activated the sphinx_thebe extension.
        if not hasattr(app.env.config, "thebe_config"):
            SPHINX_LOGGER.warning(
                "Thebe is activated but not added to extensions list. "
                "Add `sphinx_thebe` to your site's extensions list."
            )
            return
        # Will be empty if it doesn't exist
        thebe_config = app.env.config.thebe_config
    else:
        return

    if not theme_options.get("launch_buttons", {}).get("thebe"):
        return

    # Update the repository branch and URL
    # Assume that if there's already a thebe_config, then we don't want to over-ride
    if "repository_url" not in thebe_config:
        thebe_config["repository_url"] = theme_options.get("repository_url")
    if "repository_branch" not in thebe_config:
        branch = theme_options.get("repository_branch")
        if not branch:
            # Explicitly check in case branch is ""
            branch = "master"
        thebe_config["repository_branch"] = branch

    app.env.config.thebe_config = thebe_config


def check_deprecation_keys(app):
    """Warns about the deprecated keys."""

    deprecated_config_list = ["single_page"]
    for key in deprecated_config_list:
        if key in get_theme_options_dict(app):
            SPHINX_LOGGER.warning(
                f"'{key}' was deprecated from version 0.3.4 onwards. See the CHANGELOG for more information: https://github.com/executablebooks/sphinx-book-theme/blob/master/CHANGELOG.md"  # noqa: E501
                f"[{DEFAULT_LOG_TYPE}]",
                type=DEFAULT_LOG_TYPE,
            )


def update_general_config(app, config):
    theme_dir = get_html_theme_path()

    config.templates_path.append(os.path.join(theme_dir, "components"))


def update_templates(app, pagename, templatename, context, doctree):
    """Update template names and assets for page build.

    This is a copy of what the pydata theme does here to include a new section
    - https://github.com/pydata/pydata-sphinx-theme/blob/0a4894fab49befc59eb497811949a1d0ede626eb/src/pydata_sphinx_theme/__init__.py#L173 # noqa: E501
    """
    # Allow for more flexibility in template names
    template_sections = ["theme_footer_content_items"]
    for section in template_sections:
        if context.get(section):
            # Break apart `,` separated strings so we can use , in the defaults
            if isinstance(context.get(section), str):
                context[section] = [
                    ii.strip() for ii in context.get(section).split(",")
                ]

            # Add `.html` to templates with no suffix
            for ii, template in enumerate(context.get(section)):
                if not os.path.splitext(template)[1]:
                    context[section][ii] = template + ".html"


def setup(app: Sphinx):
    # Register theme
    theme_dir = get_html_theme_path()
    app.add_html_theme("sphinx_book_theme", theme_dir)
    app.add_js_file("scripts/sphinx-book-theme.js")

    # Translations
    locale_dir = os.path.join(theme_dir, "static", "locales")
    app.add_message_catalog(MESSAGE_CATALOG_NAME, locale_dir)

    # Events
    app.connect("builder-inited", update_mode_thebe_config)
    app.connect("builder-inited", check_deprecation_keys)
    app.connect("builder-inited", update_sourcename)
    app.connect("builder-inited", update_context_with_repository_info)
    app.connect("html-page-context", add_metadata_to_page)
    app.connect("html-page-context", hash_html_assets)
    app.connect("html-page-context", update_templates)

    # This extension has both theme-like and extension-like features.
    # Themes are initialised immediately before use, thus we cannot
    # rely on an event to set the config - the theme config must be
    # set in setup(app):
    update_general_config(app, app.config)
    # Meanwhile, extensions are initialised _first_, and any config
    # values set during setup() will be overwritten. We must therefore
    # register the `config-inited` event to set these config options
    app.connect("config-inited", update_general_config)

    # Nodes
    SideNoteNode.add_node(app)

    # Header buttons
    app.connect("html-page-context", prep_header_buttons)
    # Bump priority so that it runs after the pydata theme sets up the edit URL func.
    app.connect("html-page-context", add_launch_buttons, priority=501)
    app.connect("html-page-context", add_source_buttons, priority=501)
    app.connect("html-page-context", add_header_buttons, priority=501)

    # Directives
    app.add_directive("margin", Margin)

    # Post-transforms
    app.add_post_transform(HandleFootnoteTransform)

    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
