# Maintainer responsibilities

## Monitor notifications

Watch discussions and proposals from these communication channels:

- GitHub
- Discourse
- Matrix

Maintain your entry in the [`CODEOWNERS`](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) file in the respective repository.
GitHub will then request reviews for pull requests that change files you own.


Set the notification level on the [Development > Documentation](https://discourse.nixos.org/c/dev/documentation/25) Discourse category to "watching".

Join the [Nix* Documentation](https://matrix.to/#/#docs:nixos.org) Matrix room and enable relevant notifications.

As a maintainer, you have the responsibility to be responsive to `@` mentions
on GitHub, Discourse, and Matrix. If said mention is low on your priority list,
you can respond by saying that.

Finally, you should also make sure to subscribe to external resources that
falls into your area. For example, if you are a maintainer of the documentation
team, you need to be aware of the stabilisation status of Nix features. If you
are a maintainer of the security team, you need to be subscribed to CVE
publications.

## Provide guidance

As a maintainer, you will have to guide potential contributors.

This can be done by taking questions from the Discourse forum, and encouraging
the poster to write issues on GitHub, if needed, and then guide them to write
Pull Requests.

In any case, make sure to reserve time for doing Pull Request reviews, and to
only pick subjects that fall withing files that are in your `CODEOWNERS` entry.

## Take ownership of issues, pull requests, and source code

As a maintainer, you are responsible for the code you approve and merge: it is
also your responsibility to follow-up on bugs and regressions caused by this
code.
