set -euo pipefail

find extracted -name "*.shell_session" -print0 | xargs -0 -I{} sh -c 'echo "running {}"; ./convert_shell_session_to_pexpect_test.py {};'
find extracted -name "test_*" -print0 | xargs -0 -I{} sh -c 'echo "running {}"; cd `dirname {}`; ./`basename {}`'
