# Google Season of Docs 2024: write Nix docker and cross compilation guides

## About Nix

Nix is the purely functional package manager emphasizing reproducibility and reliability.
Our first release was in 2003, we have been one of the ten largest projects on GitHub for multiple consecutive years, with more than (a conservative estimate of) 15,000 users, and a total of more than 5000 contributors from all over the world. Nix finds applications in any sector using IT, with examples reaching from finances, agriculture, and research, to energy providers, space exploration, and high performance computing. The Nix ecosystem drastically improves developer experience with a unique approach to dependency management and repeatable computation.

## Problem statement

One of the superpowers enabled by the Nix ecosystem is creating outputs for multiple platforms (Linux, macOS, FreeBSD), architectures (x86, aarch64, RISC-V, etc.) and formats (statically linked binaries, Docker/OCI-images, APKs, appimages, and many more) from a single, concise recipe written in a functional programming language.
Unfortunately, the process for building anything but native binaries is barely documented, and the existing guides are out of date.

The recent spike in CPU architecture diversity in common settings created a higher demand for cross compilation support. And OCI images became the de facto standard to share software between platforms.
Nix tooling excels at cross compilation, and arguably Nix is a better container builder then Docker. Google Analytics show that the most sought-after topics on our official resources are instructions to build a Docker container from a Nix package.

Given the current state of Nix documentation and known user demand, we came to the conclusion that improving documentation for cross compilation and building container images would be highly beneficial for Nix beginners and help foster Nix adoption.

## Solution proposal

- Review existing documentation from the manuals, guides, user wiki, blog posts, etc.
- Update reference documentation and guides for cross compilation and `dockerTools`
- Reach out to Nix users of all experience levels on our forum and social media, ask them to test the new documentation, and incorporate feedback
- Add release note entries, and publish an announcement
- Delete the old documentation and link to the new one where appropriate

Work that is out-of-scope for this project:

- Refactoring parts of documentation that aren't directly related to the mentioned topics
- Adding automatic documentation tests, since that is a large project on its own
- Working on version-specific documentation, since the API's for said topics are stable

We already approached some candidates for technical writing, but none of them are able to commit until we have a confirmed budget.
As mentioned in the budgeting plan below, we are looking for two candidates, one per topic. One of the candidates for the docker documentation is [@adamcstephens](https://github.com/adamcstephens), he has a lot of experience with container technologies and already knows his way around Nixpkgs and related tooling. As for volunteer's, [@Janik-Haag](https://github.com/Janik-Haag) would be willing act in a supporting role, including activities listed in the budget item.

## Measure of success

Nixpkgs includes packages such as libraries and programs, but also helper tools for building software.
Every package in this repository gets built in continuous integration, and the build artifacts are uploaded to a public binary cache.
If someone was to cross compile something, Nix would fetch the platform-specific dependencies from the binary cache.
We measure the number of cache hits per entry using our content delivery network provider.
We would consider the cross compilation documentation successful if

- Cache hits for cross-compilation dependencies have a noticeable uptick in traffic in relation to overall Nixpkgs usage
- Traffic on the cross-compilation guide increases significantly

We would consider the cross compilation documentation successful if cache hits for said builder have a noticeable up tick in relation to overall nixpkgs usage.

Measuring the success of improving documentation for `dockerTools` is a bit more tricky, since Nix uses no special dependencies to build Docker images.
This means a rise in cache hits for Python and Coreutils as result of better `dockerTools` documentation would be indistinguishable from a large company adopting Nix as their primary build tool.
What we can do instead is plot a chart of [`dockerTools` usage](https://github.com/search?q=lang%3Anix+dockerTools&type=code) and check if it goes up in relation to overall Nixpkgs usage.
We would consider the docker documentation successful if
- There is a substantial increase in use of `dockerTools` compared to before and in relation to general Nixpkgs usage.
- Traffic on the `dockerTools` guide increases significantly

## Timeline

| Dates | Action Items |
| ---------------- | -------------------------------------------------- |
| May | Orientation / Review existing documentation pieces |
| June - September | Write guides and update reference documentation |
| October | Incorporate feedback and run evaluation |
| November | Write and publish project report |


## Budget

| Budget item | Amount [USD] | Running Total [USD] | Notes/justifications |
| ------------------ | ------ | ------------- | --------------------------------------------------------------------------------------------------- |
| Technical Writer | 10000.00 | 10000.00 | 2 People x 4000 each, one person for the docker task, and one person for the cross compilation task |
| Volunteer stipends | 500.00 | 10500.00 | organisation, evaluation, hiring technical writers, reporting |
| Total | | 10500.00 | |


## Additional information

Previous experience with technical writers or documentation:

@Janik-Haag took the Google [Technical Writing One introduction](https://developers.google.com/tech-writing/one) course and thus is aware of what to look for when reviewing documentation.
They also used the experience from that course to write documentation on platform operations at one of their previous jobs.

We also have a documentation team that works on documentation contents and infrastructure.
They do not have time to add large chunks of new documentation, but can help with reviews and sharing experience.

Previous participation in Google Season of Docs, Google Summer of Code or others:

- We organize [Summer of Nix](https://github.com/ngi-nix/summer-of-nix) in collaboration with the NLNet Foundation, which is a program that was inspired by Google Summer of Code.
- And we are participating in Google Summer of Code 2024 as a mentoring organisation
