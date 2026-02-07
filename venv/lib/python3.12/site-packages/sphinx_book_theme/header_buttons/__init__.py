"""Generate metadata for header buttons."""

from sphinx.errors import SphinxError
from sphinx.locale import get_translation
from pydata_sphinx_theme.utils import config_provided_by_user, get_theme_options_dict

from sphinx.util import logging


LOGGER = logging.getLogger(__name__)
MESSAGE_CATALOG_NAME = "booktheme"
translation = get_translation(MESSAGE_CATALOG_NAME)


def as_bool(var):
    """Cast string as a boolean with some extra checks.

    If var is a string, it will be matched to 'true'/'false'
    If var is a bool, it will be returned
    If var is None, it will return False.
    """
    if isinstance(var, str):
        return var.lower() == "true"
    elif isinstance(var, bool):
        return var
    else:
        return False


def get_repo_parts(context):
    """Return the parts of the source repository."""
    for provider in ["github", "bitbucket", "gitlab"]:
        if f"{provider.lower()}_url" in context:
            provider_url = context[f"{provider.lower()}_url"]
            source_user = context[f"{provider.lower()}_user"]
            source_repo = context[f"{provider.lower()}_repo"]
            return provider_url, source_user, source_repo, provider


def get_repo_url(context):
    """Return the provider URL based on what is defined in context."""
    provider_url, user, repo, provider = get_repo_parts(context)
    repo_url = f"{provider_url}/{user}/{repo}"
    return repo_url, provider


def prep_header_buttons(app, pagename, templatename, context, doctree):
    """Prep an empty list that we'll populate with header buttons."""
    context["header_buttons"] = []


def add_header_buttons(app, pagename, templatename, context, doctree):
    """Add basic and general header buttons, we'll add source/launch later."""
    opts = get_theme_options_dict(app)
    pathto = context["pathto"]
    header_buttons = context["header_buttons"]

    # If we have a suffix, then we have a source file
    suff = context.get("page_source_suffix")

    # Download buttons for various source content.
    if as_bool(opts.get("use_download_button", True)) and suff:
        download_buttons = []

        # An ipynb file if it was created as part of the build (e.g. by MyST-NB)
        if context.get("ipynb_source"):
            download_buttons.append(
                {
                    "type": "link",
                    "url": f'{pathto("_sources", 1)}/{context.get("ipynb_source")}',
                    "text": ".ipynb",
                    "icon": "fas fa-code",
                    "tooltip": translation("Download notebook file"),
                    "label": "download-notebook-button",
                }
            )

        # Download the source file
        download_buttons.append(
            {
                "type": "link",
                "url": f'{pathto("_sources", 1)}/{context["sourcename"]}',
                "text": suff,
                "tooltip": translation("Download source file"),
                "icon": "fas fa-file",
                "label": "download-source-button",
            }
        )
        download_buttons.append(
            {
                "type": "javascript",
                "javascript": "window.print()",
                "text": ".pdf",
                "tooltip": translation("Print to PDF"),
                "icon": "fas fa-file-pdf",
                "label": "download-pdf-button",
            }
        )

        # Add the group
        header_buttons.append(
            {
                "type": "group",
                "tooltip": translation("Download this page"),
                "icon": "fas fa-download",
                "buttons": download_buttons,
                "label": "download-buttons",
            }
        )

    # Full screen button
    if as_bool(opts.get("use_fullscreen_button", True)):
        header_buttons.append(
            {
                "type": "javascript",
                "javascript": "toggleFullScreen()",
                "tooltip": translation("Fullscreen mode"),
                "icon": "fas fa-expand",
                "label": "fullscreen-button",
            }
        )


def update_sourcename(app):
    # Download the source file
    # Sphinx defaults to .txt for html_source_suffix even though the pages almost
    # always are stored in their native suffix (.rst, .md, or .ipynb). So unless
    # the user manually specifies an html_source_suffix, default to an empty string.
    # _raw_config is the configuration as provided by the user.
    # If a key isn't in it, then the user didn't provide it
    if not config_provided_by_user(app, "html_sourcelink_suffix"):
        app.config.html_sourcelink_suffix = ""


def update_context_with_repository_info(app):
    """Update pydata `html_context` options for source from `repository_url`.

    We do this because we use repository_url as one config to define the URL,
    while the PST uses a collection of {provider}_{key} pairs in html_context.
    So here we insert those context variables on our own.
    """
    opts = get_theme_options_dict(app)
    context = app.config.html_context

    # This is the way to give repository info. If it doesn't exist, do nothing.
    repo_url = opts.get("repository_url", "")
    if not repo_url:
        return

    # Check for manually given options first
    branch = opts.get("repository_branch", "")
    provider = opts.get("repository_provider", "")
    relpath = opts.get("path_to_docs", "")
    if branch == "":
        branch = "main"

    # We assume the final two parts of the repository URL are the org/repo
    provider_url, org, repo = repo_url.strip("/").rsplit("/", 2)

    # Infer the provider if it wasn't manually given
    default_provider_urls = {
        "bitbucket": "bitbucket.org",
        "github": "github.com",
        "gitlab": "gitlab.com",
    }

    # If no provider is given, try to infer one from the repo url
    if provider == "":
        for iprov in default_provider_urls.keys():
            if iprov in provider_url.lower():
                provider = iprov
                break

    # If provider is still empty, raise an error because we don't recognize it
    if provider == "":
        raise SphinxError(
            f"Provider not recognized in repository url {repo_url}. "
            "If you're using a custom provider URL, specify `repository_provider`"
        )

    # Update the context because this is what the get_edit_url function uses.
    repository_information = {
        f"{provider}_user": org,
        f"{provider}_repo": repo,
        f"{provider}_version": branch,
        f"{provider}_url": provider_url,
        "doc_path": relpath,
    }
    context.update(repository_information)
