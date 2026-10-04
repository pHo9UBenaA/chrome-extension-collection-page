#!/usr/bin/env bash
set -Eeuo pipefail

# Source: https://gist.github.com/pHo9UBenaA/fe77d657f6f0b2dcef0d0c9cd1546192
# Run from the repository root. All audits run, even if an earlier audit fails.
if [[ $# -ne 0 ]]; then
  echo "Usage: $0 (no arguments)" >&2
  exit 2
fi

workflowFiles=()
for workflowFile in "$PWD"/.github/workflows/*.yml "$PWD"/.github/workflows/*.yaml; do
  if [[ -f "$workflowFile" ]]; then
    workflowFiles+=("$workflowFile")
  fi
done
if [[ ${#workflowFiles[@]} -eq 0 ]]; then
  echo 'No workflows found in .github/workflows.' >&2
  exit 2
fi

for tool in ghalint zizmor actionlint shellcheck; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Required tool not found: $tool" >&2
    exit 2
  fi
done

GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-${ZIZMOR_GITHUB_TOKEN:-}}}"
if [[ -z "$GH_TOKEN" ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo 'Online audits require GH_TOKEN, GITHUB_TOKEN, or an authenticated gh CLI.' >&2
    exit 2
  fi
  if ! GH_TOKEN="$(gh auth token 2>/dev/null)"; then
    echo 'Could not read a GitHub token from gh; authenticate gh or set GH_TOKEN/GITHUB_TOKEN.' >&2
    exit 2
  fi
fi
if [[ -z "$GH_TOKEN" ]]; then
  echo 'GitHub token is empty.' >&2
  exit 2
fi
export GH_TOKEN
unset ZIZMOR_OFFLINE ZIZMOR_NO_ONLINE_AUDITS

auditExitCode=0
runAudit() {
  local auditName="$1"
  shift
  printf '\n== %s ==\n' "$auditName"
  if ! "$@"; then
    auditExitCode=1
  fi
}

runAudit ghalint ghalint run
runAudit zizmor zizmor --no-progress --strict-collection --pedantic --no-ignores "${workflowFiles[@]}"
runAudit actionlint actionlint "${workflowFiles[@]}"
if [[ "$auditExitCode" -eq 0 ]]; then
  echo 'All GitHub Actions checks passed.'
fi
exit "$auditExitCode"
