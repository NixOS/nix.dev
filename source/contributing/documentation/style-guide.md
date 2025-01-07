# Style guide

This document outlines the guidelines we use when writing documentation.

## Writing style

### Aim for clarity and brevity

> I would have written a shorter letter, but I did not have the time.
>
> — [Blaise Pascal](https://en.m.wikiquote.org/w/index.php?title=Blaise_Pascal&oldid=2978584#Quotes)

Readers' time and attention is limited.
Take the time to be extraordinarily respectful with their cognitive resources.

The same holds for communication directed to contributors and maintainers:
This is a public project, and many people will read what you write.
Use this leverage with care.

- Follow the evidence-based [plain language guidelines](https://www.plainlanguage.gov/guidelines/).

  - Don't use jargon. Readers may not be familiar with particular technical terms.
  - Don't use long, complicated words if there are shorter, simpler words that convey the same meaning.

- Use the imperative voice when giving instructions.
  For example, write:

  > Add the `python310` package to `buildInputs`.

  Don't use a conversational tone, as it distracts from the contents.
  For example, don't write:

  > Going forward, let's now add the `python310` package to `buildInputs` as we have seen in the previous tutorial.

### Use inclusive language

Adapted from [Contributor Covenant] and [The Carpentries Code of Conduct]:

- Use welcoming and inclusive language
- Show empathy and respect towards other people
- Be respectful of different viewpoints and experiences
- Give and gracefully accept constructive criticism
- Focus on what is best for the community

Avoid idioms as they can be hard to understand for non-native English speakers.

Don't try to be funny.
Humor is highly culturally sensitive.
At best, jokes may obfuscate the relevant instructions.
At worst, jokes may offend readers and invalidate our effort to help them learn.

Don't use references to popular culture.
What you may consider well-known may be entirely obscure and distracting to people from different backgrounds.

[Contributor Covenant]: https://github.com/EthicalSource/contributor_covenant/blob/cd7fcf684249786b7f7d47ba49c23a6bcb3233eb/content/version/2/1/code_of_conduct.md
[The Carpentries Code of Conduct]: https://github.com/carpentries/docs.carpentries.org/blob/fb188fa8d7f57ad85eb525091e335ed0d8fea16d/source/policies/coc/index.md#L13-L19

### Voice

Describe the subject factually and use the imperative voice in direct instructions.

Do not assume a personal relationship with readers, prefer clarity and brevity to emotional appeal.

Use "you" to refer to the reader and only use "we" to refer to the authors.
Both should be rarely needed.

For example:

> You will have to deploy secrets to the remote machine.
> We chose to show the explicit, manual process using `scp` here, but there are various tools to automate that.

### Be correct, cite sources

The only thing worse than no documentation is _incorrect documentation_.
One way to ensure correctness is by citing your sources.
If you make a claim about how something works (e.g. that a command line argument exists), link to official documentation for that subject.
We would like to maintain a network of documentation, so linking to other documentation helps to reinforce the documentation ecosystem.

It is explicitly encouraged to update or restructure the manuals where appropriate, to improve the overall experience.

## Markup and source

### Code samples

Always motivate code before showing it, describing in words what it is for or what it will do.

::::{admonition} Counter-example
:class: error

````markdown
Run this command:

```bash
:(){ :|:& };:
```
````
::::

Non-trivial examples may need additional explanation, especially if they use concepts from outside the given context.
Use a collapsed content box for explanation that would distract from the reading flow.

::::{admonition} Example
:class: tip

````markdown
Set off a [fork bomb](https://en.wikipedia.org/wiki/Fork_bomb):

```bash
:(){ :|:& };:
```

:::{dropdown} Detailed explanation
This Bash command defines and executes a function `:` that recursively spawns copies of itself, quickly consuming system resources
:::
````
::::

Always explain code in the text itself.
Use comments in code samples very sparingly, for instance to highlight a particular aspect.

Readers tend to glance over large amounts of code when scanning for information, even if most of it is comments.
Especially beginners will likely find reading more complex-looking code strenuous and may therefore avoid it altogether.

If a code sample appears to require a lot of inline explanation, consider replacing it with a simpler one.
If that's not possible, break the example down into multiple parts, explain them separately, and then show the combined result at the end.

Code samples that are _intended_ to work should work.

If you are going to present an example that does not work (e.g. you're illustrating a common mistake) explain so beforehand.
Many readers will get stuck trying to make example code work without reading ahead to find out that the code isn't intended to work.

Code samples should all include a programming language when applicable for syntax highlighting when rendered e.g.

````
```python
print("Hello, World!")
```
````

### Headers

Reserve the largest header (`#`) for the title.

Use Markdown headers `##` through `###` to divide up content in the body of the document.
Finer grained headings are not necessarily better.

### One line per sentence

Write one sentence per line.

This makes long sentences immediately visible.
It also makes it easier to review changes and provide direct suggestions, since the GitHub review interface is line-oriented.

### Links

Use [reference links](https://github.github.com/gfm/#reference-link) – sparingly – to ease source readability.
Put definitions close to their first use.

:::{admonition} Example
:class: tip

```markdown
We follow the [Diátaxis](https://diataxis.fr/) approach to structure documentation.
This framework distinguishes between [tutorials], [guides], [reference], and [explanation].

[tutorials]: https://diataxis.fr/tutorials/
[guides]: https://diataxis.fr/how-to-guides/
[reference]: https://diataxis.fr/reference/
[explanation]: https://diataxis.fr/explanation/
```
:::

Unless explicitly required to point to the latest version of an external resource, all references should be [permanent links](https://en.wikipedia.org/wiki/Permalink).

Many web services offer permalinks, such as:

- [GitHub URLs to specific commits](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files)
- [Wikipedia URLs to specific page versions](https://en.wikipedia.org/wiki/Wikipedia:Linking_to_Wikipedia#Permanent_links_to_old_versions_of_pages)
- [Internet Archive "Save Page Now" for persisting web pages](https://web.archive.org/save)
