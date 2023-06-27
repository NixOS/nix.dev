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
[diataxis_tutorial]: https://diataxis.fr/tutorials/

### Submit a draft PR
Once the outline PR has been merged, work can begin on a draft of the tutorial.
Follow the [how to write a tutorial][tutorial_guide] guide and adhere to the [style guide][style_guide] while writing to follow conventions used throughout the rest of the site's documentation and make review less labor intensive for maintainers.

Submit a PR with a draft of the tutorial using the [tutorial template][tutorial_template], placing the draft in the `source/tutorials/learning-journey`.
The PR should be opened against the `learning-journey` branch.
At this point the draft will receive editorial review from @zmitchell and technical review from @infinisil or @roberth.

The draft will become an official tutorial if it passes review.

[tutorial_template]: ../../../source/tutorials/learning-journey/template.md
[tutorial_guide]: ../../../source/contributing/writing-a-tutorial.md
[style_guide]: ../../../source/contributing/style-guide.md
