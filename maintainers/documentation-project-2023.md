# Documentation project proposal 2023

## Offer a learning journey for Nix beginners

Nix is an open source build system, a configuration management system, and a mechanism for deploying software, focused on reproducibility.
It is the basis of an ecosystem of exceptionally powerful tools – including Nixpkgs, the largest, most up-to-date software repository in the world, and NixOS, a Linux distribution that can be configured fully declaratively.
Nix exists since 2003 and today is leveraged and relied upon by many professionals and organisations who recognise its value in the software development lifecycle.

The [NixOS Foundation](https://nixos.org/community/#foundation) was founded in 2015 to shepherd the Nix ecosystem, and is dedicated to supporting volunteer teams in their activities.

The Nix documentation team was established in mid 2022 in order to ease learning Nix for beginners and support community efforts in that direction.
Recently the team has gained many new members eager to tackle long-standing issues.

From the perspective of the NixOS Foundation, a concerted effort can help the Nix documentation team to substantially improve a crucial part of the Nix onboarding experience.

References:
- [Documentation Team: Flattening the learning curve](https://discourse.nixos.org/t/documentation-team-flattening-the-learning-curve/20003)
- [Documentation Team: Call for maintainers](https://discourse.nixos.org/t/documentation-team-call-for-maintainers/25970)

## Problem statement

There is no obvious way for beginners to learn using Nix most effectively.
There are too many different, contradictory, partially outdated resources all over the internet.
First-time users quickly get disoriented and confused.
Even after months of continuous discovery, many still feel like beginners.

## Solution proposal

Design a learning journey ranging from the first encounter with Nix to mastering the skills needed to leverage common use cases.

As a minimum viable product, build a curriculum and associated lesson plans, oriented around user needs and according to best practices.
As stretch goals, implement particular lessons identified as the most impactful to new users.

## Scope

1. Develop a curriculum draft

   1. Collect inputs

      - Distill problems with existing approaches revealed by [2022 usability studies](https://discourse.nixos.org/t/usability-studies/21404)
      - Documentation team's [vision statement](https://github.com/NixOS/nix.dev/blob/master/CONTRIBUTING.md#vision)
      - Evaluate and expand preliminary [documentation survey](https://github.com/NixOS/nix.dev/blob/3d23d36bc66448962dfa3c93080bc143e92642f8/maintainers/working_groups/learning_journey/documentation-survey.md)
      - Experience reports from teaching Nix

   1. Identify learning objectives

      - high-level (example: create a development environment with Nix)
      - mid-level (example: use Nixpkgs to package your JavaScript project)
      - low-level (example: find a specific version of a package in Nixpkgs history)

   1. Develop a draft for a learning journey
   1. Validate the draft with Nix experts
   1. Make the resulting outline immediately visible for beginners at well-known [touchpoints](https://en.wikipedia.org/wiki/Touchpoint).

1. Categorise existing documentation materials into the [Diátaxis framework](https://diataxis.fr), and arrange them in a meaningful order emerging from the curriculum.

   - Create detailed GitHub issue descriptions where we encounter gaps, and use them as placeholders (also to measure demand)

1. Break down tasks for the writing phase

   - Inspiration can be taken from our [contribution guidelines](https://nix.dev/contributing/documentation)

1. Prepare a contributor workflow

   - Revise [tutorial template](https://nix.dev/contributing/writing-a-tutorial)
   - Validate [contribution guidelines](https://nix.dev/contributing/documentation) with new contributors

1. Link or migrate existing documentation into a central location, as far as possible.

   - There are some constraints due to incompatible licenses

1.  Prepare and publish a call for contributors for the writing phase

Out of scope for this project:

- Writing tutorials or guides
- Improvements to the technical infrastructure related to documentation

## Stretch goal

If time and motivation allows, test run the contribution workflow:

- Pick a topic in the learning journey, for example one particular tutorial, which is identified as most impactful for beginners
- Audit and update or rewrite reference documentation it will be based on
- Write a tutorial or guide on that topic
  - Leverage previously collected (third-party) materials as much as possible

Depending on available capacity, the group may create one or multiple articles.
Authors will consult with the domain experts on a regular basis.

## Measure of success

At the end of the writing phase we will run another round of usability studies concerning the orientation phase of onboarding, and compare with existing results.
Specifically, we will evaluate, based on a set of pre-determined tasks:
- In how far beginners understand the purpose of and follow the proposed curriculum
- How well beginners are able to address their questions using the available materials

We will also inspect community metrics before the beginning and after the end of the project in order to estimate the change in adoption of certain skills.
Specifically, these metrics may include:
- Number of questions and answers in the [Discourse Help Category](https://discourse.nixos.org/c/learn/9) on the relevant topics
- GitHub issues and pull requests concerning the documentation
    - Of particular interest are contributions to fill the gaps left in the curriculum by missing materials
    - We expect this to indicate interaction with the new and updated materials
- Social media echo and anecdotal evidence

These metrics are so noisy that they have to be considered purely qualitative and best-effort.
They can be expected to be strongly influenced by accompanied communication by the [Nix marketing team](https://nixos.org/community/teams/marketing), depending on that team's capacity.
The experience with last year's development of the [Nix language tutorial](https://nix.dev/tutorials/nix-language) may serve as a frame of reference.

## Budget

Our main budgeting consideration is that the financial support should enable work that would otherwise be impossible.

We consider the greatest leverage of a funded project to be the increased visibility into activities around documentation and the organisational learning we expect to happen in the process.
Additionally, we see our diverse community as our greatest collective asset.
A setup that enables beginners to grow into proficient contributors, domain experts sharing their experience with the whole community, and engaged volunteers taking first steps into the professional world – to us this promises the greatest long-term payoff.

Since creating documentation is much less "writing things down" and much more "building and disseminating knowledge", we decided to focus on paid support by domain experts, who shall guide activities, mentor contributors and share knowledge, and supervise progress.
With a symbolic compensation we intend to encourage those contributors who otherwise would not step up to participate to take the opportunity for learning Nix and developing their technical writing skills, while creating lasting value for all users of the Nix ecosystem.
We also want to incentivise community volunteers to provide documentation-specific technical support to contributors.

The NixOS Foundation and the Nix documentation team are committed to make the project happen.
If we are awarded the grant, we have backing to close a funding gap of up to $5000.

| Budget item    | Amount    | Running total | Notes        |
|----------------|-----------|---------------|--------------|
| Editorial lead | 12000 USD | 12000 USD     |              |
| Nix expert     | 6000 USD  | 18000 USD     |              |
| 6 contributors | 3000 USD  | 21000 USD     | 500 USD each |
| 2 volunteers   | 1000 USD  | 22000 USD     | 500 USD each |
| **total**      |           | 22000 USD     |              |

The amounts will be adjusted according to the Google Summer of Code [Purchasing Power Parity table](https://developers.google.com/open-source/gsoc/help/student-stipends), depending on the country of origin of applicants.

## Timeline

We plan for four project phases, each taking roughly a month.

| Time    | Phase          |
|---------|----------------|
| 2023-05 | Planning       |
| 2023-06 | Implementation |
| 2023-07 | Evaluation     |

### Planning

The planning phase will begin with a briefing and orientation period for everyone to get acquainted with each other and the situation.
This phase involves review of the materials prepared by the documentation team, preliminary research, and creation of a refined project plan.

The refined project plan is to be comprised of

- Task breakdowns and assignments
- Timeline with weekly granularity
- Weekly schedules
- An evaluation strategy

for the remaining phases.

### Implementation

Implement the project according to the detailed plan based on the [proposed scope](#scope).

### Evaluation

The evaluation phase is for [measuring project success](#measure-of-success), reflecting on what has been done, compiling a final report, and debriefing.

Depending on work load and contributor availability, this may be the time to reach for the [stretch goal](#stretch-goal) and fill one or more lesson plans with life.

## Roles

In this section we outline each role's responsibilities and estimates on the time commitment required to fulfill them.
These estimates are based on the experience of running the [Summer of Nix 2022](https://summer.nixos.org/) program.

### Editorial lead

The editorial lead will take responsibility for the overall project and its success.
The role's focus is to facilitate or carry out all activities necessary to reach the project's objectives.

Expected are a qualification or a track record in didactics, strong written and verbal communication skills in English, as well as experience in project management.
A technical background is a strong plus.

| Phase          | Estimated effort |
|----------------|------------------|
| Planning       | 20h/w            |
| Implementation | 20h/w            |
| Evaluation     | 20h/w            |

Total estimated effort: 240h

### Nix expert

An expert Nix contributor will be available for answering technical questions concerning Nix specifics to everyone involved.
The main concern is guiding the curriculum design, and introducing participants to the Nix ecosystem's particularities.
We can expect issues to emerge in the process, and the Nix expert will be responsible for addressing them within the project's timeline as far as possible.

| Phase          | Estimated effort |
|----------------|------------------|
| Planning       | 10h/w            |
| Implementation | 15h/w            |
| Evaluation     | 5h/w             |

Total estimated effort: 120h

### Contributors

Authors mainly take the role of learners with the responsibility to structure, make use of, and, first and foremost, write down their insights.
They are assisted by the domain experts to reach a high standard of quality with their work.

Proficiency in written communication in English, and basic experience with Markdown as well as Git version control is required.

| Phase          | Estimated effort |
|----------------|------------------|
| Planning       | 5h/w             |
| Implementation | 10h/w            |
| Evaluation     | 5h/w             |

Total estimated effort: 80h

### Volunteer supporters

The purpose of this role is to have someone available to support contributors when they encounter technical problems with the development process.
This is likely to happen when the level of technical proficiency of participants varies due to their diverse backgrounds.

Total estimated effort: variable

## Additional information

[@fricklerhandwerk](https://github.com/fricklerhandwerk) ([Tweag](https://tweag.gio)) is the *organisation admistrator* for this project.

He founded the [Nix documentation team](..), and during and after Summer of Nix 2022
- ran a set of usability studies
- led the development of a Nix language tutorial
- mentored and supported documentation contributors

Currently he contributes to the Nix reference manual as a maintainer, and supports the Nix documentation team in its activities.

### Rationale for our approach

This project proposal was developed collaboratively by the Nix documentation team.

- We have evidence for the current problems in the usability studies (and countless anecdotes)
- Project scope is clearly defined by common use cases
- Guidance by experts will disseminate knowledge and skills in the community
    - This will immediately benefit both users and contributors
    - Setting good examples will impact the quality of future work
- Having a predetermined structure for contributions will accelerate developing the body of documentation
- Immediate user value by enabling quicker orientation and onboarding

# Get in touch

If you have questions, please contact the [Nix documentation team](./README.md).

If you have suggestions, please open a pull request to change this file.
