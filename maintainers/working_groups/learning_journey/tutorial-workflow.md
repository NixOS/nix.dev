# Tutorial Workflow

This document describes the recommended workflow when creating tutorials for the learning journey tutorial series.

## Writing process
### Pick a tutorial
There are [tracking issues][tracking_issues] for tutorials that the working group has decided should exist as part of the tutorial series.
Pick an issue that covers a topic that you're either knowledgeable about or have a particular interest in, then comment on the issue indicating your interest in working on the tutorial.

The tracking issue will contain status information such as whether PRs have been submitted to create an outline or a draft of the article or whether someone else has already started work on the tutorial.
Make sure to read the issue fully to ensure that you don't duplicate work that someone else is already doing!

[tracking_issues]: https://github.com/NixOS/nix.dev/issues?q=is%3Aissue+is%3Aopen+label%3Atracking+label%3A%22learning+journey%22

### Submit an outline PR
Work on the tutorial series will take place in the `learning-journey` branch.
Submit a PR with an outline of the tutorial using the [tutorial outline template][tutorial_outline_template], making sure to submit the PR against the `learning-journey` branch.
The outline should be placed in the [tutorial outlines directory][outlines_dir].
The outline will go through a review process to ensure that the material is satisfactory and is detailed enough that any other contributor could pick it up and work on it.
In particular, the tutorial outline should:

- Be a tutorial as defined in the [Diataxis][diataxis_tutorial] framework.
- Clearly state the prerequisite knowledge.
- Have a well-defined scope and learning objective.

[tutorial_outline_template]: ./tutorial-outlines/template.md
[outlines_dir]: ./tutorial-outlines/
[diataxis]: https://diataxis.fr/tutorials/

### Submit a draft PR
Once the outline PR has been merged, work can begin on a draft of the tutorial.
Submit a PR with a draft of the tutorial using the [tutorial template][tutorial_template], placing the draft in the `source/tutorials/learning-journey`.
The PR should be opened against the `learning-journey` branch.
At this point the draft will receive editorial review from @zmitchell and technical review from @infinisil or @roberth.

The draft will become an official tutorial if it passes review.

[tutorial_template]: ../../../source/tutorials/learning-journey/template.md

## Style

### Link to other documentation
If you make a claim about how something works (e.g. that a command line argument exists), link to official documentation for that subject.
We would like to maintain a network of documentation, so linking to other documentation helps to reinforce the documentation ecosystem.

### Code samples
At the bare minimum code samples that are _intended_ to work should work.
If you are going to present an example that does not work (e.g. you're illustrating a common mistake) explain so beforehand so that a reader doesn't spend time trying to make it work before continuing to read.
Code samples should all include a programming language when applicable e.g.

````
```python
print("Hello, World!")
```
````

### Tone
Follow the evidence-based [plain language guidelines].
In short, be concise, prefer smaller words, avoid jargon that readers may not be familiar with, etc.

### Markup
Reserve the largest header (`#`) for the title e.g. the largest header you should use in the content of the tutorial should be `##`.

Write one sentence per line.
This makes review easier given `git`'s line-oriented diffs and GitHub's PR comment interface.

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
