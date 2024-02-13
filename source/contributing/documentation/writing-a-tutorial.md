# How to write a tutorial

This is a guide to writing tutorials about Nix.

By tutorials we mean *lessons* as described in the [Diátaxis framework for technical documentation](https://diataxis.fr/), and recommend becoming familiar with Diátaxis before proceeding.
Especially note [the difference between tutorials and guides](https://diataxis.fr/tutorials-how-to/).

We strongly recommend the book [How Learning Works (summary)](https://www.lesswrong.com/posts/mAdMkFqWzbJRB544m/book-review-how-learning-works) as a guide for designing learning materials.

## Target audience

The main target audience of Nix tutorials are software developers with at least basic experience on the Linux command line.

Experts answering questions immediately, personalised instructions and training, and other forms of apprenticeship are known to be the most effective support for learning Nix.
**These tutorials are targeted at those who don't have access to any of that**, and should therefore be written to be suitable for self-directed learning.
This is achieved by following the structure outlined here, which is primarily characterised by aiming to avoid and close all information gaps for the learner.

As a byproduct, a well-written tutorial will be useful as lecture notes for use in interactive training sessions.
Therefore, the secondary target audience are instructors teaching Nix.

## Structure

Each tutorial should have the following structure:

### What will you learn?

Describe the problem statement and learning goals.

The learning goal of a tutorial is always acquiring a skill, which is distinguished by being applicable to a set of situations with recurrent patterns.

### What do you need?

State the prerequisite knowledge and skills.
The tutorial should always be written such that the stated prerequisites are sufficient to achieve learning goals.

Examples:

- links to previous chapters
- domain-specific skills or knowledge

### How long does it take?

Estimate the reading time.
This is important for learners to make sure they have the capacity to achieve the planned tasks and thus avoid frustration that may prevent them from continuing on their journey into the Nix ecosystem.

The estimate will depend on the learner's pre-existing knowledge and proficiency.
You can note how optional skills or knowledge may influence reading time.

We recommend testing your tutorial with friends or coworkers.
This will both help with revealing implicit prerequisites as well as provide a realistic estimate of the reading time.

### Tutorial

Provide steps to achieve the learning goal.
These should take the form of direct instructions which repeatably lead to the desired outcome.

It is also worthwhile to add contextual explanations within `:::{dropdown}` blocks.
This can help with understanding while keeping distractions minimal.

### What did you learn?

Provide exercises or worked examples, and other means of self-assessment.

This is also a good place to offer the readers ways to give feedback or ask the authors questions in order to continue improving the tutorial.

### Next steps

Depending on how well a use case is explored, point the reader to

- reference manuals
- guides or other tutorials
- links to known-good external resources, with summaries
- overview of available support tools, and their state of maturity and maintenance
- overview of ideas, and state of community discussion.

We recommend making an explicit separation of practical from theoretical learning resources, as then readers will be able to quickly decide to either get things done or learn more.

External resources should have a summary to set expectations, ideally including reading time.
Blog posts should have their original title in the link, and `(<author>, <year>)`:
Give authors credit, give readers an idea of how up to date the information is.

## Process

### Pick a topic

There is a [tracking issue](https://github.com/NixOS/nix.dev/issues/572) for tutorials that the documentation team has decided should exist as part of the tutorial series.
Pick an issue that covers a topic that you're either knowledgeable about or have a particular interest in.

Check referenced issues and pull request to make sure you won't duplicate work that someone else has already started!

### Submit an pull request with an outline

Submit a pull request with an outline of the tutorial following the above structure and containing bullet points on each section's content.
Reference the tracking issue from the pull request description to announce that you're working on a tutorial.

A review will ensure the work is going in the right direction in terms of learning objectives and technical details.

### Expand on the outline

Elaborate the contents of the tutorial following your outline and the [](style-guide).
In a final review will check that everything is technically correct.
