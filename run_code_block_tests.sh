set -euo pipefail

find extracted -name "*.shell_session" -exec echo "running {}" \; -exec ./convert_shell_session_to_pexpect_test.py {} \;
find extracted -name "test_*"  -exec echo "running {}" \; -execdir {} \;
