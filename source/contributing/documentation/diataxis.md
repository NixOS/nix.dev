# Documentation framework

We aim to build our documentation according to the [Diátaxis framework for technical documentation](https://diataxis.fr), which divides documentation into four categories:

- [Tutorials](#tutorials)
- [Guides](#guides)
- [Reference](#reference)
- [Concept](#concepts)

We've found that contributors struggle to understand the differences between these categories, and while we _strongly_ recommend reading up on the Diataxis framework, we can summarize them as follows:

## Reference

Reference material should

- Focus on "what's there", simply listing which functions, classes, etc. exist
- Use terse language, with the text and layout optimized for scanning and random access
- Show relevant and complete usage examples
- Link to related items for better discoverability

## Tutorials

Tutorials walk the user through a particular activity to teach them about common tools and patterns in the ecosystem.
While the activity itself is important, the goal is also to connect the dots between other things the reader has learned.

The structure of tutorials should minimise the cognitive load on learners, and actively avoid choices and opportunities for user errors.

## Guides

Guides are a list of steps showing how to achieve a specific goal or solve a specific problem.
The goal is to help the reader reach a specific end, not understand the underlying theory or broader context.

A guide assumes that the reader already has the background to understand the topic at hand and therefore doesn't need to explain the introduction of each new concept.

## Concepts

Concepts describe the internals of a piece of code or how to think about a particular idea or entity in the ecosystem.
A concept can also describe the historical context behind why something works the way that it does today.

If you find yourself wanting to write about the nitty gritty details of how something works, you most likely want to write an explanation.

### Guides vs. Tutorials

We find that contributors primarily struggle with the difference between a Guide and a Tutorial.

Here are several explanations to help you understand the difference.

- A guide is used in a "working" context where the reader just wants a sequence of instructions to achieve an outcome.
  - In this context the reader may already know or may not care how or why these instructions work, they just want to know what to do in order to achieve the desired result.
- A tutorial is used in a "learning" context where the reader is following a sequence of instructions to gain practice performing a certain task.
  - Some small bits of motivation or explanation are helpful in this context to help a reader connect the dots with other things they may have already learned, but the focus is on the activity, not on _how_ or _why_.

A helpful analogy is landing an airplane in two different contexts.

Let's say the pilot is unconscious and you now have to land the plane to avoid a crash landing.
In this context you just want to know how not to die.
You don't care about how or why, you just want to be on the ground in one piece.
This is the context for a guide.

A pilot training in a flight simulator wants to practice landing the plane.
The pilot-in-training needs practice knowing when to deploy the landing gear, when to adjust flaps, etc.
Actually landing the plane during the flight simulation is less important than learning the individual skills that make up a successful landing.
This is the context for a tutorial.

Finally, one last way of thinking about the difference between How-to Guide and Tutorial is like this:
- Guide: "step 1: do this, step 2: do that, etc"
- Tutorial: "take my hand as I show you how to do this"

