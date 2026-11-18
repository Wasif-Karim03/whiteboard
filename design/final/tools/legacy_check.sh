#!/usr/bin/env bash
# Runs the legacy design engine (design/build.mjs, then design/tools/check_batch.mjs) in a brand-new
# disposable copy of the workspace. Both scripts write dated content into tracked files, so they must
# never run in the repo. Takes no arguments, never reuses or deletes a supplied path, fails closed.
# Usage (from anywhere inside the repo): bash design/final/tools/legacy_check.sh
set -euo pipefail

if [ "$#" -ne 0 ]; then
  echo "legacy_check.sh: takes no arguments (got $#)" >&2
  exit 1
fi

REPO=$(git rev-parse --show-toplevel)
cd "$REPO"
REPO=$(cd "$REPO" && pwd -P)

TMP_BASE=$(cd "${TMPDIR:-/tmp}" && pwd -P)
COPY=$(mktemp -d "${TMP_BASE}/wb-legacy.XXXXXX")
COPY=$(cd "$COPY" && pwd -P)

cleanup() {
  case "$COPY" in
    "$TMP_BASE"/wb-legacy.??????) rm -rf -- "$COPY" ;;
    *) echo "legacy_check.sh: not removing unexpected path $COPY" >&2 ;;
  esac
}
trap cleanup EXIT

fail() { echo "legacy_check.sh: $1" >&2; exit 1; }

[ "$COPY" != "$REPO" ] || fail "copy equals repo ($COPY)"
case "$COPY/" in "$REPO"/*) fail "copy $COPY is inside repo $REPO" ;; esac
case "$REPO/" in "$COPY"/*) fail "repo $REPO is inside copy $COPY" ;; esac
[ -d "$COPY" ] || fail "copy $COPY is not a directory"
[ -z "$(ls -A "$COPY")" ] || fail "copy $COPY is not empty"

rsync -a --exclude .git "$REPO"/ "$COPY"/
cd "$COPY"
[ "$(pwd -P)" = "$COPY" ] || fail "working directory $(pwd -P) is not the copy $COPY"
[ -f "$COPY/design/build.mjs" ] || fail "missing $COPY/design/build.mjs"

echo "legacy copy: $COPY"
set +e
node design/build.mjs > "$COPY/.legacy_build.log" 2>&1
BUILD=$?
echo "node design/build.mjs exit=$BUILD"
CHECK=skipped
if [ "$BUILD" -eq 0 ]; then
  node design/tools/check_batch.mjs > "$COPY/.legacy_check.log" 2>&1
  CHECK=$?
fi
set -e
echo "node design/tools/check_batch.mjs exit=$CHECK"
[ "$BUILD" -eq 0 ] || { tail -n 20 "$COPY/.legacy_build.log" >&2; exit 1; }
tail -n 5 "$COPY/.legacy_check.log"
[ "$CHECK" -eq 0 ] || exit 1
