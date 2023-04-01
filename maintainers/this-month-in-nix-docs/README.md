# This Month in Nix Docs
This is a script and template for compiling "This Month in Nix Docs". The process is semi-automated. The script queries a collection of Nix repositories, looking for merged PRs with documentation-related labels, RFCs (you have to look through these manually), and tracking issues in this repository.

A new post is created via:
```
$ ./new-post.sh <from YYYY-MM-DD> <to YYYY-MM-DD> >new-post.md
```

After this invocation a template post (`new-post.md`) will be filled out with the GitHub query results formatted as markdown at the end of the file. You'll also need to fill in the number and year/month at the top of the post.