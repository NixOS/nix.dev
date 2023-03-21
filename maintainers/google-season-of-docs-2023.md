> **Important**
>
> This document is **work in progress** until the submission deadline 2023-03-24.

# Google Season of Docs 2023 Project Proposal

# Offer a learning journey for Nix beginners - NixOS Foundation

Nix is an open source build system, a configuration management system, and a mechanism for deploying software, focused on reproducibility.
It is the basis of an ecosystem of exceptionally powerful tools – including Nixpkgs, the largest, most up-to-date software repository in the world, and NixOS, a Linux distribution that can be configured fully declaratively.
Nix exists since 2003 and today is leveraged and relied upon by many professionals and organisations who recognise its value in the software development lifecycle.

The [NixOS Foundation](https://nixos.org/community/#foundation) was founded in 2015 to shepherd the Nix ecosystem, and is dedicated to supporting volunteer teams in their activities.

The Nix documentation team was established in mid 2022 in order to ease learning Nix for beginners and support community efforts in that direction.
Recently the team has gained many new members eager to tackle long-standing issues.

From the perspective of the NixOS Foundation, Google Season of Docs can help the Nix documentation team to substantially improve a crucial part of the Nix onboarding experience in a concerted effort.

References:
- [Documentation Team: Flattening the learning curve](https://discourse.nixos.org/t/documentation-team-flattening-the-learning-curve/20003)
- [Documentation Team: Call for maintainers](https://discourse.nixos.org/t/documentation-team-call-for-maintainers/25970)

## Problem statement

There is no obvious way for beginners to learn using Nix most effectively.
There are too many different, contradictory, partially outdated resources all over the internet.
Even after months of continuous discovery, many users still feel like beginners.

## Solution proposal

A successful learning journey requires a curriculum designed around user needs and implemented according to best practices.

## Scope

Design and implement a learning journey from the first encounter to mastering a particular set of use cases known to work well:

1.  Outline a learning journey on the basis of the [2022 usability studies](https://discourse.nixos.org/t/usability-studies/21404).

    The learning journey shall be limited to cover skills and procedures up to an appropriately chosen point in [our vision statement](https://github.com/NixOS/nix.dev/blob/master/CONTRIBUTING.md#vision).

2.  Audit and update or rewrite reference documentation the learning journey will be based on.

    The focus is expected to be on:
    - [Nix manual: Architecture](https://nixos.org/manual/nix/stable/architecture/architecture.html)
    - [Nix manual: Derivations](https://nixos.org/manual/nix/stable/language/derivations.html)
    - [Nix manual: Nix Language](https://nixos.org/manual/nixpkgs/stable/#chap-language-support)
    - [Nixpkgs manual: `stdenv`](https://nixos.org/manual/nixpkgs/stable/#id-1.4)
    - [Nixpkgs manual: Languages and frameworks](https://nixos.org/manual/nixpkgs/stable/#chap-language-support)

3.  Write tutorials and guides that line up to a coherent curriculum and are tightly integrated with the reference documentation. 
    
    Authors will leverage existing, freely licenced (third-party) materials as much as possible:
    
    - Non-reference materials in the manuals
    - NixOS Wiki
    - Blog posts
    
    There already exists a preliminary [documentation survey](https://github.com/NixOS/nix-book/blob/main/resources.md), a [tutorial template](https://nix.dev/contributing/writing-a-tutorial), and general [contribution guidelines](https://nix.dev/contributing/documentation).
    
Out of scope for this project are improvements to the technical infrastructure related to documentation.

## Rationale for our approach

- We have evidence for the current problems in the usability studies (and countless anecdotes).
- Project direction is determined by well-supported use cases.
- Project scope is clearly defined by tutorial topics.
- Guidance by experts will disseminate knowledge and skills in the community.
    - This will immediately benefit both users and contributors.
    - Setting good examples will impact the quality of future work.
- Working visibly in one place will reduce the scatteredness by directing attention to new materials.
    - Improved quality will encourage beginners to rely on authoritative documentation first.
- Reference documentation as a prerequisite additionally serves advanced users and contributors.
  - Writing tutorials without good reference documentation is **very** hard.
- Immediate user value by enabling quick onboarding.

## Measure of success

At the end of the writing phase we will run another round of usability studies on the new and updated tutorials, and compare with existing results.
Specifically, we will evaluate how far in the curriculum beginners will progress in a given amount of time.

We will also inspect community metrics before the beginning and after the end of the project in order to estimate change in adoption rate.
Specifically, these metrics may include:
- Number of questions and answers in the [Discourse Help Category](https://discourse.nixos.org/c/learn/9) on the relevant topics
- GitHub Stars for [Nix](https://github.com/NixOS/nix/stargazers), [Nixpkgs](https://github.com/NixOS/nixpkgs/stargazers), and [nix.dev](https://github.com/NixOS/nix.dev/stargazers)
- GitHub issues and pull requests concerning the documentation, particularly the parts worked on in the project
    - We expect this to indicate interaction with the new and updated materials
- Social media echo and anecdotal evidence

These metrics are so noisy that they have to be considered purely qualitative and best-effort.
They can be expected to be strongly influenced by accompanied communication by the Nix marketing team, depending on that team's capacity.
The experience with last year's development of the [Nix language tutorial](https://nix.dev/tutorials/nix-language) may serve as a frame of reference.

## Budget

Our main budgeting consideration is that the financial support should enable work that would otherwise be impossible.

We consider the greatest leverage of a funded project to be the increased visibility into activities around documentation and the organisational learning we expect to happen in the process.
Additionally, we see our diverse community as our greatest collective asset.
A setup that enables beginners growing into proficient contributors, domain experts sharing their experience with the whole community, and engaged volunteers taking first steps into the professional world – to us this promises the greatest long-term payoff.

Since creating documentation is much less "writing things down" and much more "building and disseminating knowledge", we decided to focus on paid support by domain experts, who shall guide activities, mentor and share knowledge, and supervise progress.
With a symbolic compensation we intend to encourage those contributors who otherwise would not step up to participate, to take the opportunity for learning Nix and developing their technical writing skills, while creating lasting value for the Nix ecosystem.
We also want to support community volunteers to provide documentation-specific technical support to contributors.

This is why we estimate a budget somewhat higher than the suggested limit of $15000.
It is in principle possible to adjust project scope, but the budget itself is primarily determined by the largely fixed cost of the design phase.

Domain experts:

- Editorial lead ($8000)
- Didactics ($5000)
- Nix ($5500)

Volunteers:

- 5 tutorial authors ($500 each)
- Technical support ($500)

**Total estimate: $21500**

The amounts will be adjusted according to the Google Summer of Code [Purchasing Power Parity table](https://developers.google.com/open-source/gsoc/help/student-stipends), depending on the country of origin of applicants.

## Timeline

We plan for four project phases, each taking roughly a month.

| Time    | Phase      |
|---------|------------|
| 2023-05 | Planning   |
| 2023-06 | Writing    |
| 2023-07 | Review     |
| 2023-08 | Evaluation |

### Planning

The planning phase is there to refine the project scope according to available capacity.
It will begin with a briefing and orientation period for everyone to get acquainted with each other and the situation.
This phase involves review of the materials prepared by the documentation team, preliminary research, and creation of a refined project plan.

The refined project plan is to be comprised of

- Outline of the draft and review process
- Task breakdowns and assigments
- Timeline with weekly granularity
- Weekly schedules
- An evaluation strategy

for the remaining phases.

Since sufficiently complete and up-to-date reference documentation is the prerequisite for tutorials, work on that part should start immediately, guided by the Nix expert.

### Writing

In the writing phase, contributors will go off to write the tutorials on their selected or assigned topics.
They will consult with the domain experts on a regular basis, and make brief written progress reports for later use in the evaluation phase and the final report.
Domain experts are expected to be available to answer contributors' questions and assist with solving problems.

Additional routines are possible and recommended:
- Pair writing sessions
- Crowd review sessions
- Knowledge and experience sharing sessions

### Review

The purpose of the review phase is to reserve time for making and addressing asynchronous reviews (we expect that community members and new users will provide early feedback), and possibly resolving technical issues.
Depending on progress, usability studies may begin here, as well as preparations for evaluating success criteria.

### Evalation

The evaluation phase is for measuring progress success, reflecting on what has been done, compiling a final report, and debriefing.

## Roles

In this section we outline each role's responsibilities and estimates on the time commitment required to fulfill them.
These estimates are based on the experience of running the [Summer of Nix 2022](https://summer.nixos.org/) program.

### Editorial lead

The editorial lead will take responsibility for the overall project and its success.
The role's focus is to facilitate all activities necessary to reach the project's objectives.

Expected are strong written and verbal communication skills in English, as well as experience in project management.
A technical background is a strong plus.

| Phase      | Estimated effort |
|------------|------------------|
| Design     | 30h/w            |
| Writing    | 15h/w            |
| Review     | 20h/w            |
| Evaluation | 30h/w            |

Total estimated effort: 380h

### Didactics expert(s)

One or more experts in didactics, i.e. people with relevant experience in technology, scientific, or adult education, will guide and assist the project participants with designing the curriculum and individual units, following best practices from cognitive and learning science.

| Phase      | Estimated effort |
|------------|------------------|
| Design     | 20h/w            |
| Writing    | 15h/w            |
| Review     | 5h/w             |
| Evaluation | 10h/w            |

Total estimated effort: 200h

### Nix expert

An expert Nix contributor will be evailable for answering technical questions concerning Nix specifics to everyone involved.
The main concern is guiding work on the reference documentation, and introducing participants to the Nix ecosystem's particularities.
We can expect issues to emerge in the process of developing documentation and tutorials, and the Nix expert will be responsible for addressing them within the project's timeline as far as possible.

| Phase      | Estimated effort |
|------------|------------------|
| Design     | 20h/w            |
| Writing    | 20h/w            |
| Review     | 15h/w            |
| Evaluation | 10h/w            |

Total estimated effort: 260h

### Authors

Authors mainly take the role of learners with the responsibility to structure, make use of, and, first and foremost, write down their insights.
They are assisted by the domain experts to reach a high standard of quality with their work.

Proficiency in written communication in English, and basic experience with Markdown as well as Git version control is required.

| Phase      | Estimated effort |
|------------|------------------|
| Design     | 15h/w            |
| Writing    | 15h/w            |
| Review     | 10h/w            |
| Evaluation | 5h/w             |

Total estimated effort: 180h

### Volunteer supporter

The purpose of this role is to have someone available to support contributors when they encounter technical problems with the development process.
This is likely to happen when the level of technical proficiency of participants varies due to their diverse backgrounds.

Total estimated effort: variable

## Additional information

[@fricklerhandwerk](https://github.com/fricklerhandwerk) ([Tweag](https://tweag.gio)) is the *organisation admistrator* for this project.

He founded the [Nix documentation team](..), and during and after Summer of Nix 2022
- ran a set of usability studies
- led the development of a Nix language tutorial
- mentored and supported documentation contributors

He currently contributes to the Nix reference manual as a maintainer, and supports the Nix documentation team in its activities.

This project proposal was developed collaboratively by the Nix documentation team.

# Get in touch

If you have questions, please contact the [Nix documentation team](..).

If you have suggestions, please open a pull request to change this file.
