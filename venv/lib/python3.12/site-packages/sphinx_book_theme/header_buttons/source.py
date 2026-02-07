"""Source file buttons that point to the online repository."""

from pydata_sphinx_theme.utils import get_theme_options_dict
from sphinx.locale import get_translation
from sphinx.util import logging

from . import as_bool, get_repo_url

LOGGER = logging.getLogger(__name__)
MESSAGE_CATALOG_NAME = "booktheme"
translation = get_translation(MESSAGE_CATALOG_NAME)


def add_source_buttons(app, pagename, templatename, context, doctree):
    """Add the source repository buttons."""
    opts = get_theme_options_dict(app)
    header_buttons = context["header_buttons"]
    # If we have a suffix, then we have a source file
    suff = context.get("page_source_suffix")

    # Add HTML context variables that the pydata theme uses that we configure elsewhere
    # For some reason the source_suffix sometimes isn't there even when doctree is
    repo_keywords = [
        "use_issues_button",
        "use_source_button",
        "use_edit_page_button",
        "use_repository_button",
    ]
    for key in repo_keywords:
        opts[key] = as_bool(opts.get(key))

    # Create source buttons for any that are enabled
    if any(opts.get(kw) for kw in repo_keywords):
        # Loop through the possible buttons and construct+add their URL
        repo_buttons = []
        if opts.get("use_repository_button"):
            repo_url, provider = get_repo_url(context)

            repo_buttons.append(
                {
                    "type": "link",
                    "url": repo_url,
                    "tooltip": translation("Source repository"),
                    "text": translation("Repository"),
                    "icon": f"fab fa-{provider.lower()}",
                    "label": "source-repository-button",
                }
            )

        if opts.get("use_source_button") and doctree and suff:
            # We'll reuse this to make action-specific URLs
            provider, edit_url = context["get_edit_provider_and_url"]()
            # Convert URL to a blob so it's for viewing
            if provider.lower() == "github":
                # Use plain=1 to ensure the source text is shown, not rendered
                source_url = edit_url.replace("/edit/", "/blob/") + "?plain=1"
            elif provider.lower() == "gitlab":
                source_url = edit_url.replace("/edit/", "/blob/")
            elif provider.lower() == "bitbucket":
                source_url = edit_url.replace("?mode=edit", "")

            repo_buttons.append(
                {
                    "type": "link",
                    "url": source_url,
                    "tooltip": translation("Show source"),
                    "text": translation("Show source"),
                    "icon": "fas fa-code",
                    "label": "source-file-button",
                }
            )

        if opts.get("use_edit_page_button") and doctree and suff:
            # We'll reuse this to make action-specific URLs
            provider, edit_url = context["get_edit_provider_and_url"]()
            repo_buttons.append(
                {
                    "type": "link",
                    "url": edit_url,
                    "tooltip": translation("Suggest edit"),
                    "text": translation("Suggest edit"),
                    "icon": "fas fa-pencil-alt",
                    "label": "source-edit-button",
                }
            )

        if opts.get("use_issues_button"):
            repo_url, provider = get_repo_url(context)
            if provider in ("github", "gitlab"):
                if provider == "github":
                    url = f"{repo_url}/issues/new?title=Issue%20on%20page%20%2F{context['pagename']}.html&body=Your%20issue%20content%20here."  # noqa: E501
                elif provider == "gitlab":
                    url = f"{repo_url}/-/issues/new?issue[title]=Issue%20on%20page%20%2F{context['pagename']}.html&issue[description]=Your%20issue%20content%20here."  # noqa: E501
                repo_buttons.append(
                    {
                        "type": "link",
                        "url": url,
                        "text": translation("Open issue"),
                        "tooltip": translation("Open an issue"),
                        "icon": "fas fa-lightbulb",
                        "label": "source-issues-button",
                    }
                )
            else:
                LOGGER.warning(f"Open issue button not yet supported for {provider}")

        # If we have multiple repo buttons enabled, add a group, otherwise just 1 button
        if len(repo_buttons) > 1:
            header_buttons.append(
                {
                    "type": "group",
                    "tooltip": translation("Source repositories"),
                    "icon": f"fab fa-{provider.lower()}",
                    "buttons": repo_buttons,
                    "label": "source-buttons",
                }
            )
        elif len(repo_buttons) == 1:
            # Remove the text since it's just a single button, want just an icon.
            repo_buttons[0]["text"] = ""
            header_buttons.extend(repo_buttons)
