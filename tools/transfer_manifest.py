"""Check transfer integrity; refresh with --write after staging intentional edits."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "docs/transfer-manifest.json"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    if args.write:
        paths = subprocess.check_output(
            ["git", "ls-files", "-z"], cwd=ROOT
        ).decode("utf-8").split("\0")
        entries = []
        for name in sorted(set(paths) - {"", MANIFEST.relative_to(ROOT).as_posix()}):
            data = (ROOT / name).read_bytes()
            entries.append({"path": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
        MANIFEST.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")
        print(f"Recorded {len(entries)} files in {MANIFEST.relative_to(ROOT)}")
        return 0
    failures = []
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for entry in entries:
        path = ROOT / entry["path"]
        if not path.resolve().is_relative_to(ROOT):
            failures.append(f"Invalid path: {entry['path']}")
        elif not path.is_file():
            failures.append(f"Missing: {entry['path']}")
        else:
            data = path.read_bytes()
            if len(data) != entry["bytes"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
                failures.append(f"Changed: {entry['path']}")
    for failure in failures:
        print(failure)
    print(f"{len(entries)} files checked; {len(failures)} missing or changed.")
    return bool(failures)


if __name__ == "__main__":
    raise SystemExit(main())
