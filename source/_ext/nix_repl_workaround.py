from pygments.lexer import RegexLexer
from pygments.token import Text

class NixReplLexer(RegexLexer):
    name = 'Nix REPL'
    aliases = ['nix-repl']
    filenames = []

    tokens = {
        'root': [
            (r'.+', Text),
        ],
    }
