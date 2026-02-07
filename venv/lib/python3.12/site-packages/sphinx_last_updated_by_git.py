"""Get the "last updated" time for each Sphinx page from Git."""
from collections import defaultdict
from contextlib import suppress
from datetime import datetime, timezone
from pathlib import Path
import subprocess

from sphinx.locale import _
from sphinx.util.i18n import format_date
from sphinx.util.logging import getLogger
from sphinx.util.matching import Matcher
try:
    from sphinx.util.display import status_iterator
except ImportError:
    # For older Sphinx versions, will be removed in Sphinx 8:
    from sphinx.util import status_iterator


__version__ = '0.3.8'


logger = getLogger(__name__)


def update_file_dates(git_dir, exclude_commits, file_dates):
    """Ask Git for "author date" of given files in given directory.

    A git subprocess is executed at most three times:

    * First, to check which of the files are even managed by Git.
    * With only those files (if any), a "git log" is created and parsed
      until all requested files have been found.
    * If the root commit is reached (i.e. there is at least one of the
      requested files that has never been edited since the root commit),
      git is called again to check whether the repo is "shallow".

    """
    requested_files = set(file_dates)
    assert requested_files

    existing_files = subprocess.check_output(
        [
            'git', 'ls-tree', '--name-only', '-z', 'HEAD',
            '--', *requested_files
        ],
        cwd=git_dir,
        stderr=subprocess.PIPE,
    ).rstrip().rstrip(b'\0')
    if not existing_files:
        return  # None of the requested files are under version control
    existing_files = existing_files.decode('utf-8').split('\0')
    requested_files.intersection_update(existing_files)
    assert requested_files

    process = subprocess.Popen(
        [
            'git', 'log', '--pretty=format:%n%at%x00%H%x00%P',
            '--author-date-order', '--relative', '--name-only',
            '--no-show-signature', '-z', '-m', '--', *requested_files
        ],
        cwd=git_dir,
        stdout=subprocess.PIPE,
        # NB: We ignore stderr to avoid deadlocks when reading stdout
    )
    with process:
        parse_log(process.stdout, requested_files,
                  git_dir, exclude_commits, file_dates)
        # We don't need the rest of the log if there's something left:
        process.terminate()


def parse_log(stream, requested_files, git_dir, exclude_commits, file_dates):
    requested_files = set(f.encode('utf-8') for f in requested_files)

    line0 = stream.readline()

    # First line is blank
    assert not line0.rstrip(), 'unexpected git output in {}: {}'.format(
        git_dir, line0)

    while requested_files:
        line1 = stream.readline()
        if not line1:
            msg = 'end of git log in {}, unhandled files: {}'
            assert exclude_commits, msg.format(
                git_dir, requested_files)
            msg = 'unhandled files in {}: {}, due to excluded commits: {}'
            logger.warning(
                msg.format(git_dir, requested_files, exclude_commits),
                type='git', subtype='unhandled_files')
            break
        pieces = line1.rstrip().split(b'\0')
        assert len(pieces) == 3, 'invalid git info in {}: {}'.format(
            git_dir, line1)
        timestamp, commit, parent_commits = pieces
        line2 = stream.readline().rstrip()
        assert line2.endswith(b'\0'), 'unexpected file list in {}: {}'.format(
            git_dir, line2)
        line2 = line2.rstrip(b'\0')
        assert line2, 'no changed files in {} (parent commit(s): {})'.format(
            git_dir, parent_commits)
        changed_files = line2.split(b'\0')

        if commit in exclude_commits:
            continue

        too_shallow = False
        if not parent_commits:
            is_shallow = subprocess.check_output(
                # --is-shallow-repository is available since Git 2.15.
                ['git', 'rev-parse', '--is-shallow-repository'],
                cwd=git_dir,
                stderr=subprocess.PIPE,
            ).rstrip()
            if is_shallow == b'true':
                too_shallow = True

        for file in changed_files:
            try:
                requested_files.remove(file)
            except KeyError:
                continue
            else:
                file_dates[file.decode('utf-8')] = timestamp, too_shallow


def _env_updated(app, env):
    # NB: We call git once per sub-directory, because each one could
    #     potentially be a separate Git repo (or at least a submodule)!

    def to_relpath(f: Path) -> str:
        with suppress(ValueError):
            f = f.relative_to(app.srcdir)
        return str(f)

    src_paths = {}
    src_dates = defaultdict(dict)
    excluded = Matcher(app.config.git_exclude_patterns)
    exclude_commits = set(
        map(lambda h: h.encode('utf-8'), app.config.git_exclude_commits))

    for docname, data in env.git_last_updated.items():
        if data is not None:
            continue  # No need to update this source file
        if excluded(env.doc2path(docname, False)):
            continue
        srcfile = Path(env.doc2path(docname)).resolve()
        src_dates[srcfile.parent][srcfile.name] = None
        src_paths[docname] = srcfile.parent, srcfile.name

    srcdir_iter = status_iterator(
        src_dates, 'getting Git timestamps for source files... ',
        'fuchsia', len(src_dates), app.verbosity, stringify_func=to_relpath)
    for git_dir in srcdir_iter:
        try:
            update_file_dates(git_dir, exclude_commits, src_dates[git_dir])
        except subprocess.CalledProcessError as e:
            msg = 'Error getting data from Git'
            msg += ' (no "last updated" dates will be shown'
            msg += ' for source files from {})'.format(git_dir)
            if e.stderr:
                msg += ':\n' + e.stderr.decode('utf-8')
            logger.warning(msg, type='git', subtype='subprocess_error')
        except FileNotFoundError as e:
            logger.warning(
                '"git" command not found, '
                'no "last updated" dates will be shown',
                type='git', subtype='command_not_found')
            return

    dep_paths = defaultdict(list)
    dep_dates = defaultdict(dict)

    candi_dates = defaultdict(list)
    show_sourcelink = {}

    for docname, (src_dir, filename) in src_paths.items():
        show_sourcelink[docname] = True
        date = src_dates[src_dir][filename]
        if date is None:
            if not app.config.git_untracked_show_sourcelink:
                show_sourcelink[docname] = False
            if not app.config.git_untracked_check_dependencies:
                continue
        else:
            candi_dates[docname].append(date)
        for dep in env.dependencies[docname]:
            # NB: dependencies are relative to srcdir and may contain ".."!
            if excluded(dep):
                continue
            depfile = Path(env.srcdir, dep).resolve()
            if not depfile.exists():
                logger.warning(
                    "Dependency file %r, doesn't exist, skipping",
                    depfile,
                    location=docname,
                    type='git',
                    subtype='dependency_not_found',
                )
                continue
            dep_dates[depfile.parent][depfile.name] = None
            dep_paths[docname].append((depfile.parent, depfile.name))

    depdir_iter = status_iterator(
        dep_dates, 'getting Git timestamps for dependencies... ',
        'turquoise', len(dep_dates), app.verbosity, stringify_func=to_relpath)
    for git_dir in depdir_iter:
        try:
            update_file_dates(git_dir, exclude_commits, dep_dates[git_dir])
        except subprocess.CalledProcessError as e:
            pass  # We ignore errors in dependencies

    for docname, deps in dep_paths.items():
        for dep_dir, filename in deps:
            date = dep_dates[dep_dir][filename]
            if date is None:
                continue
            candi_dates[docname].append(date)

    for docname in src_paths:
        timestamps = candi_dates[docname]
        if timestamps:
            # NB: too_shallow is only relevant if it affects the latest date.
            timestamp, too_shallow = max(timestamps)
            if too_shallow:
                timestamp = None
                logger.warning(
                    'Git clone too shallow', location=docname,
                    type='git', subtype='too_shallow')
        else:
            timestamp = None
        env.git_last_updated[docname] = timestamp, show_sourcelink[docname]


def _html_page_context(app, pagename, templatename, context, doctree):
    context['last_updated'] = None
    lufmt = app.config.html_last_updated_fmt
    if lufmt is None or 'sourcename' not in context:
        return
    if 'page_source_suffix' not in context:
        # This happens in 'singlehtml' builders
        assert context['sourcename'] == ''
        return

    data = app.env.git_last_updated[pagename]
    if data is None:
        # There was a problem with git, a warning has already been issued
        timestamp = None
        show_sourcelink = False
    else:
        timestamp, show_sourcelink = data
    if not show_sourcelink:
        del context['sourcename']
        del context['page_source_suffix']
    if timestamp is None:
        return

    utc_date = datetime.fromtimestamp(int(timestamp), timezone.utc)
    date = utc_date.astimezone(app.config.git_last_updated_timezone)
    context['last_updated'] = format_date(
        lufmt or _('%b %d, %Y'),
        date=date,
        language=app.config.language)

    if app.config.git_last_updated_metatags:
        context['metatags'] += """
    <meta property="article:modified_time" content="{}" />""".format(
            date.isoformat())


def _config_inited(app, config):
    if config.html_last_updated_fmt is None:
        config.html_last_updated_fmt = ''
    if isinstance(config.git_last_updated_timezone, str):
        from babel.dates import get_timezone
        config.git_last_updated_timezone = get_timezone(
            config.git_last_updated_timezone)


def _builder_inited(app):
    env = app.env
    if not hasattr(env, 'git_last_updated'):
        env.git_last_updated = {}


def _source_read(app, docname, source):
    env = app.env
    if docname not in env.found_docs:
        # Since Sphinx 7.2, "docname" can be None or a relative path
        # to a file included with the "include" directive.
        # We are only interested in actual source documents.
        return
    if docname in env.git_last_updated:
        # Again since Sphinx 7.2, the source-read hook can be called
        # multiple times when using the "include" directive.
        return
    env.git_last_updated[docname] = None


def _env_merge_info(app, env, docnames, other):
    env.git_last_updated.update(other.git_last_updated)


def _env_purge_doc(app, env, docname):
    try:
        del env.git_last_updated[docname]
    except KeyError:
        pass


def setup(app):
    """Sphinx extension entry point."""
    app.require_sphinx('1.8')  # For "config-inited" event
    app.connect('html-page-context', _html_page_context)
    app.connect('config-inited', _config_inited)
    app.connect('env-updated', _env_updated)
    app.connect('builder-inited', _builder_inited)
    app.connect('source-read', _source_read)
    app.connect('env-merge-info', _env_merge_info)
    app.connect('env-purge-doc', _env_purge_doc)
    app.add_config_value(
        'git_untracked_check_dependencies', True, rebuild='env')
    app.add_config_value(
        'git_untracked_show_sourcelink', False, rebuild='env')
    app.add_config_value(
        'git_last_updated_timezone', None, rebuild='env')
    app.add_config_value(
        'git_last_updated_metatags', True, rebuild='html')
    app.add_config_value('git_exclude_patterns', [], rebuild='env')
    app.add_config_value(
        'git_exclude_commits', [], rebuild='env')
    return {
        'version': __version__,
        'parallel_read_safe': True,
        'env_version': 1,
    }
