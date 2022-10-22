# Maintainer responsibilities

## Notifications

A maintainer must watch discussions and proposals from the different
communication channels: GitHub, Discourse, and Matrix.

To monitor GitHub, you must have your own entry in the `.github/CODEOWNERS`
file. GitHub will then notify you and request you for review for Pull Requests
that change files that you own.

Start by choosing a restricted set of files you want to watch. Keep in mind
that choosing a broad set of files can lead to too frequent notifications.
Then, ask for `write` access to the repository, which is needed for the
`CODEOWNERS` file to be valid.

On the Discourse topic for your team, make sure to set your notification level
to "watching".

On Matrix, make sure to join rooms related to your team, and to enable
notifications.

As a maintainer, you have the responsibility to be responsive to `@` mentions
on GitHub, Discourse, and Matrix. If said mention is low on your priority list,
you can respond by saying that.

Finally, you should also make sure to subscribe to external resources that
falls into your area. For example, if you are a maintainer of the documentation
team, you need to be aware of the stabilisation status of Nix features. If you
are a maintainer of the security team, you need to be subscribed to CVE
publications.

## Guidance

As a maintainer, you will have to guide potential contributors.

This can be done by taking questions from the Discourse forum, and encouraging
the poster to write issues on GitHub, if needed, and then guide them to write
Pull Requests.

In any case, make sure to reserve time for doing Pull Request reviews, and to
only pick subjects that fall withing files that are in your `CODEOWNERS` entry.

## Following-up

As a maintainer, you are responsible for the code you approve and merge: it is
also your responsibility to follow-up on bugs and regressions caused by this
code.
