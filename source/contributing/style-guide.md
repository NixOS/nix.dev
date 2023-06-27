# Style guide

This document outlines the guidelines we use when writing documentation.

## Writing style

### Be kind

Adapted from [Contributor Covenant] and [The Carpentries Code of Conduct]:

- Use welcoming and inclusive language
- Show empathy and respect towards other people
- Be respectful of different viewpoints and experiences
- Give and gracefully accept constructive criticism
- Focus on what is best for the community

[Contributor Covenant]: https://github.com/EthicalSource/contributor_covenant/blob/cd7fcf684249786b7f7d47ba49c23a6bcb3233eb/content/version/2/1/code_of_conduct.md
[The Carpentries Code of Conduct]: https://github.com/carpentries/docs.carpentries.org/blob/4691971d9f49544054410334140a4fd391a738da/topic_folders/policies/code-of-conduct.md

### Use simple, obvious language

Follow the evidence-based [plain language guidelines].
In short, prefer smaller words and avoid jargon that readers may not be familiar with.

[plain language guidelines]: https://www.plainlanguage.gov/guidelines/

### Use culturally neutral language

Avoid idioms as they can be hard to understand for non-native English speakers.

Don't try to be funny.
Humor is highly culturally sensitive.
At best, jokes may obfuscate the relevant instructions.
At worst, jokes may offend readers and invalidate our effort to help them learn.

Don't use references to popular culture.
What you may consider well-known may be entirely obscure and distracting to people from different backgrounds.

### Be concise

> I would have written a shorter letter, but I did not have the time.
>
> — [Blaise Pascal][Blaise Pascal]

Readers' time and attention is limited.

Take the time to be extraordinarily respectful with their cognitive resources.

The same holds for communication directed to contributors and maintainers: This is a public project, and many people will read what you write. Use this leverage with care.

[Blaise Pascal]: https://en.m.wikiquote.org/w/index.php?title=Blaise_Pascal&oldid=2978584#Quotes

### Voice
Describe the subject factually and use the imperative voice in direct instructions.

Do not assume a personal relationship with readers, prefer clarity and brevity to emotional appeal.

Use second person ("you") to refer to the reader and only use "we" to refer to the Nix Community.

### Be correct, cite sources
The only thing worse than no documentation is _incorrect documentation_.
One way to ensure correctness is by citing your sources.
If you make a claim about how something works (e.g. that a command line argument exists), link to official documentation for that subject.
We would like to maintain a network of documentation, so linking to other documentation helps to reinforce the documentation ecosystem.

It is explicitly encouraged to update or restructure the manuals where appropriate, to improve the overall experience.

## Markup and source

### Code samples
At the bare minimum code samples that are _intended_ to work should work.

If you are going to present an example that does not work (e.g. you're illustrating a common mistake) explain so beforehand.
Many readers will get stuck trying to make example code work without reading ahead to find out that the code isn't intended to work.

Code samples should all include a programming language when applicable e.g.

````
```python
print("Hello, World!")
```
````

### Headers
Reserve the largest header (`#`) for the title e.g. the largest header you should use in the content of the tutorial should be `##`.

### One line per sentence
Write one sentence per line.
This makes review easier since the git diffs are line-oriented and the smallest level of granularity in the GitHub review interface is a line of text.

### Links

Unless explicitly required to point to the latest version of an external resource, all references should be [permanent links].

Many web services offer permalinks, such as:

- [GitHub URLs to specific commits]
- [Wikipedia URLs to specific page versions]
- [Internet Archive "Save Page Now" for persisting web pages]

Use [reference links][ref_links] to keep the source legible.
All links in a section should be grouped together at the end.
For instance:

```
## This is a section
Lorem ipsum dolor sit amet, [consectetur][adipiscing] elit. Suspendisse rutrum ligula porta, condimentum dui dignissim, imperdiet mi. Sed interdum lacus nec varius posuere. Duis auctor varius purus, ut ornare purus tempus eu. Aliquam erat volutpat. Etiam eget nunc malesuada, elementum neque eget, mollis metus. Nulla suscipit felis nec accumsan fermentum.

Integer volutpat erat sem, non varius turpis facilisis eu. Nam eu [ullamcorper][magna]. Morbi iaculis vel urna in condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec tellus sit amet tellus venenatis porta in et ex. Nunc sodales nisl magna, at dictum diam sollicitudin id. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec facilisis, sapien eu faucibus iaculis, nibh nibh condimentum enim, nec egestas turpis erat nec libero. Curabitur ut tincidunt odio. Praesent sed tincidunt tortor.

[adipiscing]: example.com
[magna]: example.com
```

[ref_links]: https://github.github.com/gfm/#reference-link
[permanent links]: https://en.m.wikipedia.org/wiki/Permalink
[GitHub URLs to specific commits]: https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files
[Wikipedia URLs to specific page versions]: https://en.m.wikipedia.org/wiki/Wikipedia:Linking_to_Wikipedia#Permanent_links_to_old_versions_of_pages
[Internet Archive "Save Page Now" for persisting web pages]: https://web.archive.org/save
