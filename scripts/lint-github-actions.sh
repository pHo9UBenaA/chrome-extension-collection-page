#!/usr/bin/env bash
set -Eeuo pipefail

# Source: https://gist.github.com/pHo9UBenaA/fe77d657f6f0b2dcef0d0c9cd1546192
# Run from the repository root. No options: all adopted audits are enabled.
[[ $# -eq 0 ]] || { echo "Usage: $0 (no arguments)" >&2; exit 2; }
root="$PWD"
files=()
for file in "$root"/.github/workflows/*.yml "$root"/.github/workflows/*.yaml; do
  if [[ -f "$file" ]]; then files+=("$file"); fi
done
[[ ${#files[@]} -gt 0 ]] || { echo 'No workflows found in .github/workflows.' >&2; exit 2; }
for tool in ghalint zizmor actionlint shellcheck; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Required tool not found: $tool" >&2; exit 2; }
done
GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-${ZIZMOR_GITHUB_TOKEN:-}}}"
if [[ -z "$GH_TOKEN" ]]; then
  if ! command -v gh >/dev/null 2>&1 || ! GH_TOKEN="$(gh auth token 2>/dev/null)"; then
    echo 'Online audits require GH_TOKEN, GITHUB_TOKEN, or an authenticated gh CLI.' >&2
    exit 2
  fi
fi
[[ -n "$GH_TOKEN" ]] || { echo 'GitHub token is empty.' >&2; exit 2; }
export GH_TOKEN
unset ZIZMOR_OFFLINE ZIZMOR_NO_ONLINE_AUDITS

status=0
check() {
  local name="$1"
  shift
  printf '\n== %s ==\n' "$name"
  if ! "$@"; then status=1; fi
}
# All workflows are in scope: ghalint can scan the caller's CWD directly.
check ghalint ghalint run
check zizmor zizmor --no-progress --strict-collection --pedantic --no-ignores "${files[@]}"
check actionlint actionlint "${files[@]}"
if [[ "$status" -eq 0 ]]; then echo 'All GitHub Actions checks passed.'; fi
exit "$status"
