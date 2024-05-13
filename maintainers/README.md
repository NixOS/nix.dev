# Nix documentation team

The Nix documentation team was formed to [flatten the infamous learning curve](https://discourse.nixos.org/t/documentation-team-flattening-the-learning-curve/20003).

## Goals

- Ease learning, increase onboarding success and user retention
- Improve organisation of Nix knowledge
- Lead, guide, and support related community efforts

## Motivation

To improve the state of affairs with Nix onboarding and documentation, we have to tackle some big issues and work through many small ones:
implement structural changes after gathering the necessary social support;
fix numerous little problems and help people get their contributions merged.

It requires significant time or resources to do this consistently.
The team is built around that limitation, and therefore organized as a praxicracy:
You are in charge if and only if you get the work done.

The team’s reason to exist is to make that principle discoverable and reproducible by laying groundwork and setting examples.

## Members

Current members are listed on [the website](https://nixos.org/community/teams/documentation/), and can be pinged using the GitHub team [`@NixOS/documentation-team`](https://github.com/orgs/NixOS/teams/documentation-team).

## Responsibilities

### Team

Ordered by priority:

1. Establish and maintain guidelines for contributing to documentation in the Nix ecosystem
1. Extend and curate [nix.dev] as the central learning resource
1. Review and merge [Nix pull requests], [Nixpkgs pull requests], and [NixOS pull requests] concerning documentation
1. Keep track of [Nix issues], [Nixpkgs issues], and [NixOS issues] concerning documentation
1. Maintain and develop documentation infrastructure
1. Monitor the [*Documentation* Discourse category]
1. Monitor the [*Nix\* Documentation* Matrix room]

[nix.dev]: https://nix.dev
[Nix pull requests]: https://github.com/NixOS/nix/pulls?q=is%3Aopen+is%3Apr+label%3Adocumentation
[Nixpkgs pull requests]: https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%228.has%3A+documentation%22%2C%226.topic%3A+documentation%22
[NixOS pull requests]: https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%226.topic%3A+nixos%22+label%3A%228.has%3A+documentation%22%2C%226.topic%3A+documentation%22
[Nix issues]: https://github.com/NixOS/nix/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation
[Nixpkgs issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%229.needs%3A+documentation%22
[NixOS issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%229.needs%3A+documentation%22+label%3A%226.topic%3A+nixos%22
[*Documentation* Discourse category]: https://discourse.nixos.org/c/dev/documentation/25
[*Nix\* Documentation* Matrix room]: https://app.element.io/#/room/#docs:nixos.org
[changes to the NixOS Wiki]: https://matrix.to/#/#nixos-wiki:utzutzutz.net

In addition, the team has to perform administrative tasks which it distributes across team members:

- Triage issues and pull requests
- Curate the [GitHub project board]
- Invite new participants
- Schedule meetings
- Moderate and keep to the schedule
- Take and publish meeting notes
- Keep team information up to date

Team members are encouraged to become maintainers and take ownership of some piece of documentation they care about.
The team lead supports team members who want to take on [maintainer responsibilities](./responsibilities.md).

### Team lead

- Set a direction and agendas
- Represent the team
- Publish announcements and reports
- Exercise elevated privileges:
  - Manage permissions for the [GitHub team] and the [GitHub project board]
  - Update [NixOS calendar] events
  - Merge pull requests approved by team members

[GitHub team]: https://github.com/orgs/NixOS/teams/documentation-team
[GitHub project board]: https://github.com/orgs/NixOS/projects/15
[NixOS calendar]: https://calendar.google.com/calendar/u/0/embed?src=b9o52fobqjak8oq8lfkhg3t0qg@group.calendar.google.com

## Office hours

The team currently holds [office hours every work day](https://discourse.nixos.org/t/documentation-office-hours-onboarding-for-new-maintainers/45015).
Check the [NixOS calendar] for details.

These meetings are free for everyone to join.
Contact [@fricklerhandwerk] to get a calendar invitation for reminders and updates.

### Meeting links

- [Jitsi conference](https://jitsi.lassul.us/nix-documentation)
- [Meeting notes scratchpad][collaborative scratchpad]
- [GitHub project board]

[Previous meeting notes](https://discourse.nixos.org/search?q=documentation%20team%20meeting%20notes%20%23%20%23dev%3Adocumentation%20in%3Atitle%20order%3Alatest_topic)

### Meeting protocol

The purpose of the meetings is to
- work on documentation together
- coordinate efforts
- share knowledge
- make strategic decisions

As the Nix community is distributed globally, available time for synchronous communication is highly limited and therefore very valuable.
Writing is still the primary medium of communication.

To keep discussions highly focused and make their results discoverable and accessible, we will:

- Prepare a meeting agenda in the [collaborative scratchpad]
  - Estimate and follow estimated discussion time for each agenda item
  - Pull requests have priority
  - Invite authors to the meetings if possible
- Take notes in the [collaborative scratchpad]
- Add notes to existing issues or pull requests as a comment and link them back to the meeting notes
- Merge pull requests made on the last session
- Submit new pull requests or issues
- Post the meeting notes on the [*Documentation* Discourse category]

[collaborative scratchpad]: https://pad.lassul.us/p-Y8MjU2SdSD5qO1fnpCPA?edit#

Meeting notes should contain:

- Date of meeting
- List of attendees
- Results and links to GitHub issues and pull requests for each agenda item

## Contributing

If you want to help immediately, please see [How to contribute to documentation](https://nix.dev/contributing/documentation).

## Sponsoring

- [@fricklerhandwerk] serves as the team lead since 2023-02, sponsored by [Antithesis](https://antithesis.com)
- [@zmitchell] led the Learning Journey Working Group from 2023-03 to 2023-08, sponsored by [flox](https://floxdev.com)
- [@infinisil](https://github.com/infinisil) works on the team since 2022-11, sponsored by [Tweag]
- [@lucperkins](https://github.com/lucperkins) served as the team lead from 2022-11 to 2023-01, sponsored by [Determinate Systems](https://determinate.systems)
- [@fricklerhandwerk] served as the team lead from 2022-05 to 2022-10, sponsored by [Tweag]

[@fricklerhandwerk]: https://github.com/fricklerhandwerk
[@zmitchell]: https://github.com/zmitchell
[Tweag]: https://tweag.io

## History

Many thanks to past members, who helped make Nix documentation what it is today:

- [@brianmcgee](https://github.com/brianmcgee) was part of the team from 2023-03 to 2023-10 and contributed to the Learning Journey Working Group effort.

- [@zmitchell] led the [Learning Journey Working Group](https://discourse.nixos.org/search?q=learning%20journey%20working%20group%20-%20meeting%20notes%20in%3Atitle%20order%3Alatest_topic) from 2023-03 to 2023-08 that added a number of tutorials.
  He published [regular updates on developments in documentation](https://discourse.nixos.org/search?q=This%20Month%20in%20Nix%20Docs%20in%3Atitle%20order%3Alatest_topic) in that period.

- [@Mic92](https://github.com/Mic92) was a founding member and part of the team from 2022-05 to 2023-01.
  Jörg had written a great deal of documentation on the NixOS Wiki, and shared his experience to set a direction for the documentation team.

- [@domenkozar](https://github.com/domenkozar) was a founding member and part of the team from 2022-05 to 2023-01.
  Domen originally started nix.dev, wrote many basic tutorials, and funded editorial work through [Cachix](https://www.cachix.org/).
  He helped bootstrap the documentation team, handed out permissions, and advised us on many aspects.
  Domen donated nix.dev to the NixOS Foundation 2023-07.

