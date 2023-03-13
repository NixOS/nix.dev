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

- Valentin Gagarin ([@fricklerhandwerk])

  Nix documentarian, [Tweag]
  
  [@fricklerhandwerk]: https://github.com/fricklerhandwerk
  [Tweag]: https://tweag.io

- Silvan Mosberger ([@infinisil])

  [@infinisil]: https://github.com/infinisil

  Nixpkgs maintainer, [Tweag]

- [@pennae](https://github.com/pennae) (they/them)

  NixOS and Nixpkgs contributors

- Olaf Hochherz (Github: [@olafklingt], Discourse: [@olaf])

  [@olafklingt]: https://github.com/olafklingt
  [@olaf]: https://discourse.nixos.org/u/olaf

## Responsibilities

### Team

Ordered by priority:
1. establish and maintain guidelines for contributing to documentation
1. extend and curate [nix.dev] as the central learning resource – long-term vision: The Nix Book
1. review and merge [Nix pull requests] and [Nixpkgs and NixOS pull requests] concerning documentation
1. keep track of [Nix issues] and [Nixpkgs and NixOS issues] concerning documentation
1. monitor the [*Documentation* Discourse category]
1. monitor the [*Nix\* Documentation* Matrix room]
1. monitor [changes to the NixOS Wiki]

[nix.dev]: https://nix.dev
[Nix pull requests]: https://github.com/NixOS/nix/pulls?q=is%3Aopen+is%3Apr+label%3Adocumentation
[Nixpkgs and NixOS pull requests]: https://github.com/NixOS/nixpkgs/pulls?q=is%3Aopen+is%3Apr+label%3A%228.has%3A+documentation%22
[Nix issues]: https://github.com/NixOS/nix/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation
[Nixpkgs and NixOS issues]: https://github.com/NixOS/nixpkgs/issues?q=is%3Aopen+is%3Aissue+label%3A%229.needs%3A+documentation%22
[*Documentation* Discourse category]: https://discourse.nixos.org/c/dev/documentation/25
[*Nix\* Documentation* Matrix room]: https://app.element.io/#/room/#docs:nixos.org
[changes to the NixOS Wiki]: https://matrix.to/#/#nixos-wiki:utzutzutz.net

### Team lead

- represent the team:
  - publish announcements and reports
  - keep team information up to date
- lead team meetings:
  - set the agenda
  - invite participants
  - announce meetings on the calendar
  - moderate and keep schedule
  - take and publish notes

## Team meetings

The team holds weekly meetings on **Tuesdays 13:00-14:00 and Thursdays 17:30-18:30 (Europe/Berlin)**:
- [NixOS calendar](https://calendar.google.com/calendar/u/0/embed?src=b9o52fobqjak8oq8lfkhg3t0qg@group.calendar.google.com)
- [Discourse community calendar](https://discourse.nixos.org/t/community-calendar/18589)

These meetings are free for everyone to join.
Contact [@fricklerhandwerk] to get a calendar invitation.

### Meeting links

- [Jitsi conference](https://meet.jit.si/nix-documentation)
- [Meeting notes scratchad](https://pad.lassul.us/p-Y8MjU2SdSD5qO1fnpCPA)
- [GitHub project board](https://github.com/orgs/NixOS/projects/15)

[Previous meeting notes](https://discourse.nixos.org/search?q=documentation%20team%20meeting%20%23dev%3Adocumentation%20order%3Alatest)

### Meeting protocol

The purpose of the meetings is to
- make strategic decisions
- coordinate efforts
- exchange experience and insights.

As the Nix community is distributed globally, available time for synchronous communication is highly limited and therefore very valuable.
Writing is still the primary medium of communication.

To keep discussions highly focused and make their results accessible, we will:

- prepare meeting agendas as pull requests on the [nix.dev repository](https://github.com/NixOS/nix.dev)
  - pull requests have priority, invite authors to the meetings
  - annotate estimated discussion time for each agenda item, it should be followed
- prepare notes collaboratively in a [HedgeDoc scratchpad]
- merge pull requests made on the last session
- submit new pull requests or issues
- add notes to existing issues or pull requests as a comment
- post the meeting protocol on the [*Documentation* Discourse category]
- update calendar invitations

[HedgeDoc scratchpad]: https://pad.lassul.us/p-Y8MjU2SdSD5qO1fnpCPA?edit#

Meeting notes should contain:

- date of meeting
- list of attendees
- results and links to GitHub issues and pull requests for each agenda item

## Contributing

If you want to help immediately, please see [How to contribute to documentation](./how-to-contribute-to-documentation.md).

## Funding

This effort is sponsored by [Determinate Systems].
[@lucperkins] will serve as the team lead until 2023-01.

This effort was sponsored by [Tweag].
[@fricklerhandwerk] served as the team lead from 2022-05 to 2022-10.

