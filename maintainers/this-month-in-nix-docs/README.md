# This month in Nix documentation

This is a script and template for compiling "This month in Nix documentation".
The process is semi-automated:
The script queries a collection of Nix repositories, looking for merged PRs with documentation-related labels, RFCs (you have to look through these manually), and tracking issues in this repository.

Create a new report with:

```
$ ./make-post.sh <from YYYY-MM-DD> <to YYYY-MM-DD> > report.md
```

There is some post-processing required:
- Fill in the issue number and year/month at the top of the post.
- Manually check the RFCs for relevance
- Remove the "Tracking issues" section, it's there for your convenience while writing.

