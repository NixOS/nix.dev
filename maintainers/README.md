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

## Roles

### Team member

In order of priority, team members collaborate to:

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

In addition, the team performs administrative tasks which it distributes across team members:

- Triage issues and pull requests
- Curate the [GitHub project board]
- Invite new participants
- Schedule meetings
- Moderate and keep to the schedule
- Take and publish meeting notes
- Keep team information up to date

Team members are encouraged to become maintainers and take ownership of some piece of documentation they care about.
The team lead supports team members who want to take on [maintainer responsibilities](./responsibilities.md).

Team members will have priority access to project funding from our donation budget to support their initiatives.

### Team lead

In addition to the team members' responsibilities, a team lead is expected to:

- Set a direction and agendas
- Represent the team
- Publish announcements and reports
- Exercise elevated privileges:
  - Manage permissions for the [GitHub team] and the [GitHub project board]
  - Update [NixOS calendar] events
  - Merge pull requests approved by team members
  - Manage [the team's Open Collective page]

[GitHub team]: https://github.com/orgs/NixOS/teams/documentation-team
[GitHub project board]: https://github.com/orgs/NixOS/projects/15
[NixOS calendar]: https://calendar.google.com/calendar/u/0/embed?src=b9o52fobqjak8oq8lfkhg3t0qg@group.calendar.google.com

## Office hours

The documentation team currently does not hold regular meetings.
Feel free to revive this tradition!

- [Jitsi conference](https://jitsi.lassul.us/nix-documentation)
- [Meeting notes scratchpad][collaborative scratchpad]

A history of events, discussions, decisions, and work done is recorded in [team meeting notes](https://discourse.nixos.org/search?q=documentation%20team%20meeting%20notes%20%23%20%23dev%3Adocumentation%20in%3Atitle%20order%3Alatest_topic) and [update announcements](https://discourse.nixos.org/search?q=This%20Month%20in%20Nix%20Docs%20in%3Atitle%20order%3Alatest_topic).

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

If you don't have time, consider donating to [documentation team on Open Collective][the team's Open Collective page].

[the team' Open Collective page]: https://opencollective.com/nixos/projects/nix-documentation

