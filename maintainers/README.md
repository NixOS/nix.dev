# Nix documentation team

The Nix documentation team was formed to flatten the infamous learning curve.

## Goals

- ease learning, increase onboarding success and user retention
- improve organization of knowledge
- lead, guide, and support related community efforts

## Motivation

To improve the state of affairs with Nix onboarding and documentation, we have to tackle some big issues and work through many small ones:
implement structural changes after gathering the necessary social support;
fix numerous little problems and help people get their contributions merged.

It requires significant time or resources to do this consistently.
The team is built around that limitation, and therefore organized as a praxicracy:
you are in charge if and only if you get the work done.

The team’s reason to exist is to make that principle discoverable and reproducible by laying groundwork and setting examples.

## Members
The team membership list is maintained on the [Nix community documentation team page]. 

[nixos community documentation team page]: https://nixos.org/community/teams/documentation

## Working Groups
- [Learning Journey](working_groups/learning_journey/README.md)

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

## Team meetings

The team holds weekly meetings on Mondays 16:00-17:00 and Thursdays 16:00-17:00 (Europe/Berlin):
- [NixOS calendar]
- [Discourse community calendar](https://discourse.nixos.org/t/community-calendar/18589)

These meetings are free for everyone to join.
Contact [@fricklerhandwerk] to get a calendar invitation.

### Meeting links

- [Jitsi conference](https://meet.jit.si/nix-documentation)
- [Meeting notes scratchpad][collaborative scratchpad]
- [GitHub project board]

[Previous meeting notes](https://discourse.nixos.org/search?q=documentation%20team%20meeting%20%23dev%3Adocumentation%20order%3Alatest)

### Meeting protocol

The purpose of the meetings is to
- make strategic decisions
- coordinate efforts
- share knowledge

As the Nix community is distributed globally, available time for synchronous communication is highly limited and therefore very valuable.
Writing is still the primary medium of communication.

To keep discussions highly focused and make their results discoverable and accessible, we will:

- Prepare meeting agendas in the [collaborative scratchpad]
  - Estimate and follow estimated discussion time for each agenda item
  - Pull requests have priority
  - Invite authors to the meetings if possible
- Take notes in a [collaborative scratchpad]
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
- [@infinisil] works on the team since 2022-11, sponsored by [Tweag]
- [@lucperkins](https://github.com/lucperkins) served as the team lead from 2022-11 to 2023-01, sponsored by [Determinate Systems](https://determinate.systems)
- [@fricklerhandwerk] served as the team lead from 2022-05 to 2022-10, sponsored by [Tweag]

