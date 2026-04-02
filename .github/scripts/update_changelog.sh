#!/usr/bin/env bash
# Appends one numbered line to CHANGELOG.md using Cursor Agent CLI for a one-line summary.
# Env: BEFORE_SHA, AFTER_SHA (GitHub push event), MERGED_AT (optional ISO-ish timestamp), CHANGELOG_PATH (optional).

set -euo pipefail

CHANGELOG_PATH="${CHANGELOG_PATH:-CHANGELOG.md}"
BEFORE_SHA="${BEFORE_SHA:-}"
AFTER_SHA="${AFTER_SHA:-HEAD}"
if [[ -z "${MERGED_AT:-}" ]]; then
  MERGED_AT=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
fi

export PATH="${HOME}/.local/bin:${PATH}"

if ! command -v agent >/dev/null 2>&1; then
  echo "Cursor Agent CLI not found in PATH after install." >&2
  exit 1
fi

if [[ -z "${CURSOR_API_KEY:-}" ]]; then
  echo "CURSOR_API_KEY is not set." >&2
  exit 1
fi

next_serial() {
  if [[ ! -f "$CHANGELOG_PATH" ]]; then
    echo "1"
    return
  fi
  local max
  max=$(grep -E '^[0-9]+\.' "$CHANGELOG_PATH" 2>/dev/null | sed -E 's/^([0-9]+)\..*/\1/' | sort -n | tail -1 || true)
  if [[ -z "${max:-}" ]]; then
    echo "1"
  else
    echo $((max + 1))
  fi
}

commit_subjects() {
  if [[ -z "$BEFORE_SHA" || "$BEFORE_SHA" == "0000000000000000000000000000000000000000" ]]; then
    git log -1 --pretty=format:'%s'
    return
  fi
  local list
  list=$(git log --no-merges "${BEFORE_SHA}..${AFTER_SHA}" --pretty=format:'%s' 2>/dev/null | head -80 || true)
  if [[ -z "${list// }" ]]; then
    git log -1 --pretty=format:'%s'
  else
    printf '%s\n' "$list"
  fi
}

SERIAL="$(next_serial)"
COMMIT_LIST="$(commit_subjects)"

# Collapse newlines for the prompt (keep readable separators).
COMMIT_LIST_FLAT=$(printf '%s\n' "$COMMIT_LIST" | paste -sd '|' -)

PROMPT=$(cat <<EOF
You are writing one changelog line for a merge to the main branch.
Commit subjects (pipe-separated): ${COMMIT_LIST_FLAT}

Reply with EXACTLY ONE line of plain text: a concise summary (max 180 characters) of what changed. No leading number, no date, no quotes, no markdown, no bullet characters.
EOF
)

set +e
RAW_SUMMARY=$(agent --print --mode ask --trust --workspace "$(pwd)" --model "gpt-5.4-nano-low" "$PROMPT" 2>/dev/null)
AGENT_EXIT=$?
set -e

SUMMARY=""
if [[ $AGENT_EXIT -eq 0 && -n "${RAW_SUMMARY// }" ]]; then
  SUMMARY=$(printf '%s' "$RAW_SUMMARY" | tr '\n' ' ' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | cut -c1-300)
fi

if [[ -z "${SUMMARY// }" ]]; then
  SUMMARY=$(printf '%s\n' "$COMMIT_LIST" | head -1 | cut -c1-200)
fi

if [[ ! -f "$CHANGELOG_PATH" ]]; then
  {
    echo "# Changelog"
    echo ""
  } >"$CHANGELOG_PATH"
fi

echo "${SERIAL}. ${MERGED_AT} — ${SUMMARY}" >>"$CHANGELOG_PATH"
