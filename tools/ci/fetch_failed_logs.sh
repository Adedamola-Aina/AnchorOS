#!/usr/bin/env bash
set -euo pipefail

# fetch_failed_logs.sh
# Usage: GITHUB_TOKEN=... ./tools/ci/fetch_failed_logs.sh owner repo branch [days]
# Example: GITHUB_TOKEN=$GITHUB_TOKEN ./tools/ci/fetch_failed_logs.sh Adedamola-Aina AnchorOS fix/e2e-mfa-banner 2
# Downloads ZIP logs for recent failing workflow runs on the specified branch and extracts them to ./ci-logs

OWNER=${1:-}
REPO=${2:-}
BRANCH=${3:-}
DAYS=${4:-1}
OUTDIR=${OUTDIR:-./ci-logs}

if [ -z "$OWNER" ] || [ -z "$REPO" ] || [ -z "$BRANCH" ]; then
  echo "Usage: GITHUB_TOKEN=... $0 owner repo branch [days]"
  exit 2
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable must be set (use a PAT with repo+workflow scopes)"
  exit 3
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required. Install jq and re-run."
  exit 4
fi

mkdir -p "$OUTDIR"

SINCE=$(date -u -d "$DAYS days ago" +"%Y-%m-%dT%H:%M:%SZ")
echo "Listing failing runs for $OWNER/$REPO on branch $BRANCH since $SINCE"

API="https://api.github.com/repos/$OWNER/$REPO/actions/runs?branch=$BRANCH&per_page=100"
resp=$(curl -sS -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "$API")

failed_lines=$(echo "$resp" | jq -r --arg since "$SINCE" '.workflow_runs[] | select(.created_at >= $since) | select(.conclusion=="failure" or .conclusion=="cancelled" or .conclusion=="timed_out" or .conclusion=="action_required") | "\(.id)|\(.name)|\(.html_url)|\(.created_at)"')

if [ -z "$failed_lines" ]; then
  echo "No recent failing runs found for branch $BRANCH."
  exit 0
fi

echo "$failed_lines" | while IFS='|' read -r run_id run_name run_url run_created; do
  safe_name=$(echo "$run_name" | tr ' /' '__' | tr -cd '[:alnum:]_-.')
  zip_file="$OUTDIR/${REPO}-run-${run_id}.zip"
  out_dir="$OUTDIR/run-${run_id}"
  echo "Found failing run $run_id ($safe_name) created at $run_created"
  echo "Downloading logs to $zip_file"
  curl -L -sS -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/$OWNER/$REPO/actions/runs/$run_id/logs" -o "$zip_file"
  if [ -s "$zip_file" ]; then
    echo "Extracting to $out_dir"
    mkdir -p "$out_dir"
    if command -v unzip >/dev/null 2>&1; then
      unzip -o "$zip_file" -d "$out_dir" >/dev/null
    else
      echo "Note: unzip not found; saved zip at $zip_file"
    fi
  else
    echo "Warning: downloaded empty log archive for run $run_id"
  fi
done

echo "Completed download/extract of failing run logs to $OUTDIR"
