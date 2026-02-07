"""Launch buttons for Binder / Thebe / Colab / etc."""

from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlencode, quote

from docutils.nodes import document
from sphinx.application import Sphinx
from sphinx.locale import get_translation
from sphinx.util import logging
from shutil import copy2

from . import get_repo_parts, get_repo_url


SPHINX_LOGGER = logging.getLogger(__name__)

MESSAGE_CATALOG_NAME = "booktheme"
translation = get_translation(MESSAGE_CATALOG_NAME)


def add_launch_buttons(
    app: Sphinx,
    pagename: str,
    templatename: str,
    context: dict[str, Any],
    doctree: Optional[document],
):
    """Builds a binder link and inserts it in HTML context for use in templating.

    This is a ``html-page-context`` sphinx event (see :ref:`sphinx:events`).

    :param pagename: The sphinx docname related to the page
    :param context: A dictionary of values that are given to the template engine,
        to render the page and can be modified to include custom values.
    :param doctree: A doctree when the page is created from a reST documents;
        it will be None when the page is created from an HTML template alone.

    """

    path = app.env.doc2path(pagename)
    extension = Path(path).suffix

    # Don't do anything if no launch provider is configured
    config_theme = app.config["html_theme_options"]
    launch_buttons = config_theme.get("launch_buttons", {})
    if (
        not launch_buttons
        or not _is_notebook(app, context)
        or not any(
            launch_buttons.get(key)
            for key in ("binderhub_url", "jupyterhub_url", "thebe", "colab_url")
        )
    ):
        return

    # Grab the header buttons from context as it should already exist.
    header_buttons = context["header_buttons"]

    # Check if we have a markdown notebook, and if so then add a link to the context
    if _is_notebook(app, context) and (
        context["sourcename"].endswith(".md")
        or context["sourcename"].endswith(".md.txt")
    ):
        # Figure out the folders we want
        out_dir = Path(app.outdir)
        build_dir = out_dir.parent
        ntbk_dir = build_dir.joinpath("jupyter_execute")
        sources_dir = out_dir.joinpath("_sources")
        # Paths to old and new notebooks
        path_ntbk = ntbk_dir.joinpath(pagename).with_suffix(".ipynb")
        path_new_notebook = sources_dir.joinpath(pagename).with_suffix(".ipynb")
        # Copy the notebook to `_sources` dir so it can be downloaded
        path_new_notebook.parent.mkdir(exist_ok=True, parents=True)
        copy2(path_ntbk, path_new_notebook)
        context["ipynb_source"] = pagename + ".ipynb"

    # Get repository URL information that we'll use to build links
    repo_url, _ = get_repo_url(context)
    provider_url, org, repo, provider = get_repo_parts(context)
    if org is None and repo is None:
        # Skip the rest because the repo_url isn't right
        return

    branch = _get_branch(config_theme)

    # Construct the extra URL parts (app and relative path)
    notebook_interface_prefixes = {"classic": "tree", "jupyterlab": "lab/tree"}
    notebook_interface = launch_buttons.get("notebook_interface", "classic")
    if notebook_interface not in notebook_interface_prefixes:
        raise ValueError(
            "Notebook UI for Binder/JupyterHub links must be one"
            f"of {tuple(notebook_interface_prefixes.keys())},"
            f"not {notebook_interface}"
        )
    ui_pre = notebook_interface_prefixes[notebook_interface]

    # Check if we have a non-ipynb file, but an ipynb of same name exists
    # If so, we'll use the ipynb extension instead of the text extension
    if extension != ".ipynb" and Path(path).with_suffix(".ipynb").exists():
        extension = ".ipynb"

    # Construct a path to the file relative to the repository root
    book_relpath = config_theme.get("path_to_docs", "").strip("/")
    if book_relpath != "":
        book_relpath += "/"
    path_rel_repo = f"{book_relpath}{pagename}{extension}"

    # Container for launch buttons
    launch_buttons_list = []

    # Now build infrastructure-specific links
    jupyterhub_url = launch_buttons.get("jupyterhub_url", "").strip("/")
    binderhub_url = launch_buttons.get("binderhub_url", "").strip("/")
    colab_url = launch_buttons.get("colab_url", "").strip("/")
    deepnote_url = launch_buttons.get("deepnote_url", "").strip("/")

    # Loop through each provider and add a button for it if needed
    if binderhub_url:
        # Any non-standard repository URL should be passed-through raw
        if provider_url not in ["https://github.com", "https://gitlab.com"]:
            # Generic git repository using the full repo URL as a fallback
            url = f"{binderhub_url}/v2/git/{quote(repo_url)}/{branch}"
        elif provider.lower() == "github":
            url = f"{binderhub_url}/v2/gh/{org}/{repo}/{branch}"
        elif provider.lower() == "gitlab":
            # Binder uses %2F for gitlab for some reason
            url = f"{binderhub_url}/v2/gl/{org}%2F{repo}/{branch}"

        url = f"{url}?urlpath={ui_pre}/{path_rel_repo}"
        launch_buttons_list.append(
            {
                "type": "link",
                "text": "Binder",
                "tooltip": translation("Launch on") + " Binder",
                "icon": "_static/images/logo_binder.svg",
                "url": url,
            }
        )

    if jupyterhub_url:
        url_params = urlencode(
            dict(
                repo=repo_url, urlpath=f"{ui_pre}/{repo}/{path_rel_repo}", branch=branch
            ),
            safe="/",
        )
        url = f"{jupyterhub_url}/hub/user-redirect/git-pull?{url_params}"
        launch_buttons_list.append(
            {
                "type": "link",
                "text": "JupyterHub",
                "tooltip": translation("Launch on") + " JupyterHub",
                "icon": "_static/images/logo_jupyterhub.svg",
                "url": url,
            }
        )

    if colab_url:
        if provider.lower() != "github":
            SPHINX_LOGGER.warning(f"Provider {provider} not supported on colab.")
        else:
            url = f"{colab_url}/github/{org}/{repo}/blob/{branch}/{path_rel_repo}"
            launch_buttons_list.append(
                {
                    "type": "link",
                    "text": "Colab",
                    "tooltip": translation("Launch on") + " Colab",
                    "icon": "_static/images/logo_colab.png",
                    "url": url,
                }
            )

    if deepnote_url:
        if provider.lower() != "github":
            SPHINX_LOGGER.warning(f"Provider {provider} not supported on Deepnote.")
        else:
            github_path = f"%2F{org}%2F{repo}%2Fblob%2F{branch}%2F{path_rel_repo}"
            url = f"{deepnote_url}/launch?url=https%3A%2F%2Fgithub.com{github_path}"
            launch_buttons_list.append(
                {
                    "type": "link",
                    "text": "Deepnote",
                    "tooltip": translation("Launch on") + " Deepnote",
                    "icon": "_static/images/logo_deepnote.svg",
                    "url": url,
                }
            )

    # Add thebe flag in context
    if launch_buttons.get("thebe", False):
        launch_buttons_list.append(
            {
                "type": "javascript",
                "text": translation("Live Code"),
                "tooltip": translation("Launch Thebe"),
                "javascript": "initThebeSBT()",
                "icon": "fas fa-play",
                "label": "launch-thebe",
            }
        )
        context["use_thebe"] = True

    # Add the buttons to header_buttons
    header_buttons.append(
        {
            "type": "group",
            "tooltip": translation("Launch interactive content"),
            "icon": "fas fa-rocket",
            "buttons": launch_buttons_list,
            "label": "launch-buttons",
        }
    )


def _split_repo_url(url):
    """Split a repository URL into an org / repo combination."""
    if "github.com/" in url:
        end = url.split("github.com/")[-1]
        org, repo = end.split("/")[:2]
    else:
        SPHINX_LOGGER.warning(
            f"Currently Binder/JupyterHub repositories must be on GitHub, got {url}"
        )
        org = repo = None
    return org, repo


def _is_notebook(app, context):
    pagename = context["pagename"]
    metadata = app.env.metadata[pagename]
    if "kernelspec" in metadata:
        # Most notebooks will have this
        return True
    elif "ipynb" in context.get("page_source_suffix", ""):
        # Just in case, check for the suffix since some people remove the kernelspec
        return True
    else:
        return False


def _get_branch(config_theme):
    branch = config_theme.get("repository_branch")
    if not branch:
        branch = "master"
    return branch
