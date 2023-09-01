# Style guide

This document outlines the guidelines we use when writing documentation.

## Aim for clarity and brevity

> I would have written a shorter letter, but I did not have the time.
>
> — [Blaise Pascal](https://en.m.wikiquote.org/w/index.php?title=Blaise_Pascal&oldid=2978584#Quotes)

Readers' time and attention is limited.
Take the time to be extraordinarily respectful with their cognitive resources.

The same holds for communication directed to contributors and maintainers:
This is a public project, and many people will read what you write.
Use this leverage with care.

- Follow the evidence-based [plain language guidelines](https://www.plainlanguage.gov/guidelines/)

- Use imperative in direct instructions

- Avoid narrative or discursive style

## Be truthful

> Incorrect documentation is often worse than no documentation.
>
> — attributed to [Bertrand Meyer](https://web.archive.org/web/20080706015334/https://www.eskimo.com/~hottub/software/programming_quotes.html)

- Describe the subject factually

  Avoid value judgement or emotional appeal.
  We don't know how and for which purpose the tools we document are going to be used, and our goal is not to advertise but to teach and inform.

- Use and provide evidence

  Provide links to other resources, such as the reference manuals or source code.
  This helps guide readers on their learning journey, and discover related relevant information.
  The Nix documentation team explicitly encourages you to update or restructure the manuals where appropriate, to improve the overall experience.

  Relying on reference documentation as much as possible also reduces the maintenance burden, as many key facts can be documented in a single place.

- Show fully working examples

  Code samples must always be working correctly when run as given.
  Nix provides us with everything needed to make this happen.

- State your intent

  Errors become more obvious and easier to fix if execution can be measured against intent.
  Therefore, always make explicit the motivation behind your proposed changes.

  Add references to any relevant resources in commit messages, if it helps understand the reasoning behind a significant change.

## Use inclusive language

- Avoid idioms

  Idioms can be hard to understand for non-native English speakers.

- Don't try to be funny

  Humor is highly culturally sensitive.
  At best, jokes may obfuscate the relevant information.
  At worst, jokes may offend readers and invalidate our effort to help them learn.

- Don't use references to popular culture

  What you may consider well-known may be entirely obscure and distracting to people from different backgrounds.

- Do not presuppose a personal relationship with readers

  Address the reader with "you" only when necessary.
  Clarify identity if you use "we".
  Generally, "we" are users and contributors in the Nix ecosystem.

## Links

Unless explicitly required to point to the latest version of an external resource, all references should be [permanent links] to ensure that the referenced content is what is intended.

Many web services offer permalinks, such as:

- [GitHub URLs to specific commits]
- [Wikipedia URLs to specific page versions]
- [Internet Archive "Save Page Now" for persisting web pages]

[permanent links]: https://en.wikipedia.org/wiki/Permalink
[GitHub URLs to specific commits]: https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files
[Wikipedia URLs to specific page versions]: https://en.wikipedia.org/wiki/Wikipedia:Linking_to_Wikipedia#Permanent_links_to_old_versions_of_pages
[Internet Archive "Save Page Now" for persisting web pages]: https://web.archive.org/save

## Markdown

- Write one sentence per line.

  This makes long sentences immediately visible, and makes it easier to review changes and make suggestions.

  The rule is unambiguous and does not require tooling support to be applied easily.
  [Here is a discussion of different line wrapping styles.]

  [Here is a discussion of different line wrapping styles.]: https://mtsknn.fi/blog/4-1-wrapping-styles-for-markdown-prose-and-code-comments/

- Use [reference links](https://github.github.com/gfm/#reference-link) where needed, either to keep the plain text containing many references readable or to reuse the same link multiple times.

  Keep reference link definitions close to their use site so they are easy to find without additional tooling.

# Licensing and attribution

When opening pull requests with your own contributions, you agree to licensing your work under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

When adding material by third parties, make sure it has a license that permits this.
In that case, unambiguously state source, authors, and license in the newly added material.
Notify the authors *before* using their work.

[Add the original author as co-author](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors) to the first commit of your pull request, which should contain the original document verbatim, so we can track authorship and changes through version history.

Using free licenses other than CC-BY-SA 4.0 is possible for individual documents, and by contributing changes to those documents you agree to license your work accordingly.

