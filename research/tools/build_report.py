#!/usr/bin/env python3
"""Build the self-contained Whiteboard research report.

The generator has no third-party dependencies and performs no network access. It
reads the reviewed research tree, renders Markdown with a small safe converter,
and writes one offline HTML file with inline CSS, JavaScript, and data.

Design contract
---------------
Audience/task: university product and procurement leaders comparing evidence.
Visual idea: a quiet evidence ledger with a persistent section rail and dense,
legible tables; the content itself is the focal point.
Type: the operating system UI stack for an Apple-like, license-safe artifact.
Palette: paper, raised paper, graphite, slate, blue ink, and semantic statuses.
Rhythm: 4px primitive with 8/16/24/32/48/64px groupings.
Responsive: two-column dossier above 1040px; native mobile disclosure navigation
and horizontally scrollable data tables below it.
Motion: only short control-state transitions; none is needed to reveal content.
No-JS: all content and tables remain readable; only filtering, sorting, mobile
navigation convenience, and theme persistence are enhancements.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import html
import json
import os
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable, Sequence
from urllib.parse import quote, unquote, urlparse


RESEARCH_ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = RESEARCH_ROOT / "report"
REPORT_PATH = REPORT_DIR / "index.html"
SCHEMA_PATH = RESEARCH_ROOT / "data" / "schemas.json"
STANDARD_FILES = (
    "notes.md",
    "competitors.csv",
    "feature_matrix.csv",
    "pain_points.csv",
    "opportunities.md",
    "sources.md",
)
DOMAIN_PATTERN = re.compile(r"^(0[1-6])_(.+)$")
EXTERNAL_SCHEMES = {"http", "https", "mailto"}


def esc(value: object) -> str:
    return html.escape("" if value is None else str(value), quote=True)


def slug(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value or "section"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            raise ValueError(f"CSV has no header: {path}")
        rows = list(reader)
    for number, row in enumerate(rows, 2):
        if None in row:
            raise ValueError(f"CSV row {number} has too many columns: {path}")
    return rows


def split_multi(value: str) -> list[str]:
    if not value:
        return []
    if " | " in value:
        return [part.strip() for part in value.split(" | ") if part.strip()]
    if ";" in value:
        return [part.strip() for part in value.split(";") if part.strip()]
    return [value.strip()]


def title_from_notes(text: str, fallback: str) -> str:
    match = re.search(r"^#\s+(.+?)\s*$", text, re.MULTILINE)
    if match:
        title = re.sub(r"\s+research$", "", match.group(1), flags=re.I)
        return title.strip()
    return fallback.replace("_", " ").title()


def extract_section(markdown: str, names: Sequence[str]) -> str:
    wanted = {name.casefold() for name in names}
    lines = markdown.splitlines()
    start = None
    level = None
    for index, line in enumerate(lines):
        match = re.match(r"^(#{2,4})\s+(.+?)\s*$", line)
        if match and match.group(2).strip().casefold() in wanted:
            start = index + 1
            level = len(match.group(1))
            break
    if start is None or level is None:
        return ""
    end = len(lines)
    for index in range(start, len(lines)):
        match = re.match(r"^(#{1,6})\s+", lines[index])
        if match and len(match.group(1)) <= level:
            end = index
            break
    return "\n".join(lines[start:end]).strip()


class MarkdownRenderer:
    """Small safe renderer for the Markdown forms used in the research files."""

    def __init__(self, source_dir: Path, heading_prefix: str):
        self.source_dir = source_dir
        self.heading_prefix = heading_prefix
        self.heading_counts: Counter[str] = Counter()

    def href(self, raw: str) -> tuple[str, bool]:
        raw = raw.strip()
        parsed = urlparse(raw)
        if parsed.scheme.lower() in EXTERNAL_SCHEMES:
            return raw, True
        if parsed.scheme or raw.startswith("//"):
            return "#", False
        if raw.startswith("#"):
            return raw, False
        target = (self.source_dir / unquote(raw)).resolve()
        try:
            relative = os.path.relpath(target, REPORT_DIR).replace(os.sep, "/")
        except ValueError:
            return "#", False
        return quote(relative, safe="/%#?=&:+"), False

    def inline(self, raw: str) -> str:
        tokens: list[str] = []

        def stash(markup: str) -> str:
            tokens.append(markup)
            return f"\x00TOKEN{len(tokens) - 1}\x00"

        def code_repl(match: re.Match[str]) -> str:
            return stash(f"<code>{esc(match.group(1))}</code>")

        def link_repl(match: re.Match[str]) -> str:
            label, target = match.group(1), match.group(2)
            href, external = self.href(target)
            attrs = ' target="_blank" rel="noreferrer noopener"' if external else ""
            return stash(f'<a href="{esc(href)}"{attrs}>{esc(label)}</a>')

        raw = re.sub(r"`([^`]+)`", code_repl, raw)
        raw = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_repl, raw)
        value = esc(raw)
        value = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", value)
        value = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<em>\1</em>", value)

        url_pattern = re.compile(r"(?<![\w\"'=])(https?://[^\s<]+)")

        def auto_link(match: re.Match[str]) -> str:
            url = html.unescape(match.group(1)).rstrip(".,;")
            suffix = match.group(1)[len(html.escape(url, quote=False)) :]
            return (
                f'<a href="{esc(url)}" target="_blank" '
                f'rel="noreferrer noopener">{esc(url)}</a>{suffix}'
            )

        value = url_pattern.sub(auto_link, value)
        for index, token in enumerate(tokens):
            value = value.replace(f"\x00TOKEN{index}\x00", token)
        return value

    @staticmethod
    def table_cells(line: str) -> list[str]:
        return [cell.strip() for cell in line.strip().strip("|").split("|")]

    @staticmethod
    def is_table_rule(line: str) -> bool:
        cells = MarkdownRenderer.table_cells(line)
        return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells)

    def heading_id(self, text: str) -> str:
        base = f"{self.heading_prefix}-{slug(re.sub(r'[`*_]', '', text))}"
        self.heading_counts[base] += 1
        count = self.heading_counts[base]
        return base if count == 1 else f"{base}-{count}"

    def render(self, markdown: str) -> str:
        lines = markdown.replace("\r\n", "\n").split("\n")
        output: list[str] = []
        paragraph: list[str] = []
        list_kind: str | None = None
        in_code = False
        code_language = ""
        code_lines: list[str] = []

        def flush_paragraph() -> None:
            nonlocal paragraph
            if paragraph:
                joined = " ".join(part.strip() for part in paragraph)
                output.append(f"<p>{self.inline(joined)}</p>")
                paragraph = []

        def close_list() -> None:
            nonlocal list_kind
            if list_kind:
                output.append(f"</{list_kind}>")
                list_kind = None

        index = 0
        while index < len(lines):
            line = lines[index]
            fence = re.match(r"^```\s*([^`]*)$", line)
            if fence:
                flush_paragraph()
                close_list()
                if in_code:
                    language = f' data-language="{esc(code_language)}"' if code_language else ""
                    output.append(f"<pre{language}><code>{esc(chr(10).join(code_lines))}</code></pre>")
                    in_code = False
                    code_lines = []
                else:
                    in_code = True
                    code_language = fence.group(1).strip()
                index += 1
                continue
            if in_code:
                code_lines.append(line)
                index += 1
                continue
            if not line.strip():
                flush_paragraph()
                close_list()
                index += 1
                continue
            heading = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
            if heading:
                flush_paragraph()
                close_list()
                level = len(heading.group(1))
                text = heading.group(2)
                output.append(
                    f'<h{level} id="{self.heading_id(text)}">{self.inline(text)}</h{level}>'
                )
                index += 1
                continue
            if (
                "|" in line
                and index + 1 < len(lines)
                and self.is_table_rule(lines[index + 1])
            ):
                flush_paragraph()
                close_list()
                headers = self.table_cells(line)
                index += 2
                rows: list[list[str]] = []
                while index < len(lines) and "|" in lines[index] and lines[index].strip():
                    rows.append(self.table_cells(lines[index]))
                    index += 1
                output.append('<div class="table-shell markdown-table"><table><caption class="sr-only">Research evidence table</caption>')
                output.append("<thead><tr>")
                output.extend(f'<th scope="col">{self.inline(cell)}</th>' for cell in headers)
                output.append("</tr></thead><tbody>")
                for row in rows:
                    padded = row + [""] * max(0, len(headers) - len(row))
                    output.append("<tr>")
                    output.extend(f"<td>{self.inline(cell)}</td>" for cell in padded[: len(headers)])
                    output.append("</tr>")
                output.append("</tbody></table></div>")
                continue
            list_match = re.match(r"^\s*([-+*]|\d+[.)])\s+(.+)$", line)
            if list_match:
                flush_paragraph()
                kind = "ol" if list_match.group(1)[0].isdigit() else "ul"
                if list_kind != kind:
                    close_list()
                    output.append(f"<{kind}>")
                    list_kind = kind
                output.append(f"<li>{self.inline(list_match.group(2))}</li>")
                index += 1
                continue
            if line.startswith(">"):
                flush_paragraph()
                close_list()
                quote_lines: list[str] = []
                while index < len(lines) and lines[index].startswith(">"):
                    quote_lines.append(lines[index].lstrip("> "))
                    index += 1
                output.append(f"<blockquote>{self.inline(' '.join(quote_lines))}</blockquote>")
                continue
            if re.fullmatch(r"\s*([-*_])(?:\s*\1){2,}\s*", line):
                flush_paragraph()
                close_list()
                output.append("<hr>")
                index += 1
                continue
            paragraph.append(line)
            index += 1

        flush_paragraph()
        close_list()
        if in_code:
            output.append(f"<pre><code>{esc(chr(10).join(code_lines))}</code></pre>")
        return "\n".join(output)


def source_links(row: dict[str, str]) -> str:
    ids = split_multi(row.get("source_ids", ""))
    urls = split_multi(row.get("source_urls", ""))
    links: list[str] = []
    for index, source_id in enumerate(ids):
        if index < len(urls) and urlparse(urls[index]).scheme in {"http", "https"}:
            links.append(
                f'<a href="{esc(urls[index])}" target="_blank" '
                f'rel="noreferrer noopener">{esc(source_id)}</a>'
            )
        else:
            links.append(esc(source_id))
    return "<span class=\"source-links\">" + " ".join(links) + "</span>"


def join_nonempty(items: Iterable[str], separator: str = " · ") -> str:
    return separator.join(item for item in items if item)


def labeled(label: str, value: str) -> str:
    if not value:
        return ""
    return f'<span class="field"><span class="field-label">{esc(label)}</span>{esc(value)}</span>'


def data_table(
    table_id: str,
    caption: str,
    columns: Sequence[tuple[str, str]],
    rows: Sequence[dict[str, str]],
    cells,
    vendor_for,
    vendor_aware: bool = True,
) -> str:
    table_rows: list[str] = []
    for row in rows:
        rendered = cells(row)
        search_text = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", cell)) for cell in rendered)
        vendor = vendor_for(row) if vendor_for else ""
        attrs = (
            f'data-search="{esc(search_text.casefold())}" '
            f'data-vendor="{esc(vendor.casefold())}"'
        )
        table_rows.append(f"<tr {attrs}>" + "".join(f"<td>{cell}</td>" for cell in rendered) + "</tr>")
    headers = []
    for key, label in columns:
        headers.append(
            f'<th scope="col" data-key="{esc(key)}"><button class="sort-button" '
            f'type="button">{esc(label)}<span aria-hidden="true">↕</span></button></th>'
        )
    empty = (
        f'<tr class="empty-row" hidden><td colspan="{len(columns)}">'
        "No records match the current filters.</td></tr>"
    )
    aware = "true" if vendor_aware else "false"
    return f"""
      <div class="table-block" data-table-block>
        <div class="table-tools">
          <label for="{esc(table_id)}-search">Search {esc(caption.lower())}</label>
          <div class="search-row">
            <input id="{esc(table_id)}-search" type="search" data-table-search="{esc(table_id)}"
              placeholder="Search this table" autocomplete="off">
            <button class="quiet-button" type="button" data-clear-search="{esc(table_id)}">Clear</button>
          </div>
          <p id="{esc(table_id)}-status" class="table-status" aria-live="polite"></p>
        </div>
        <div class="table-shell">
          <table id="{esc(table_id)}" class="data-table" data-vendor-aware="{aware}">
            <caption>{esc(caption)}</caption>
            <thead><tr>{''.join(headers)}</tr></thead>
            <tbody>{''.join(table_rows)}{empty}</tbody>
          </table>
        </div>
      </div>
    """


def render_competitors(domain_key: str, rows: list[dict[str, str]]) -> str:
    columns = (
        ("product", "Product"),
        ("owner", "Owner and status"),
        ("market", "Market position"),
        ("pricing", "Pricing evidence"),
        ("scale", "Scale and customers"),
        ("assessment", "Assessment"),
        ("evidence", "Evidence"),
    )

    def cells(row: dict[str, str]) -> list[str]:
        price = join_nonempty(
            [
                labeled("Model", row.get("pricing_model", "")),
                labeled("Public", row.get("pricing_public", "")),
                labeled(
                    "Amount",
                    join_nonempty(
                        [
                            row.get("currency", ""),
                            row.get("price_amount", ""),
                            row.get("price_unit", ""),
                            row.get("price_period", ""),
                        ],
                        " ",
                    ),
                ),
                labeled("Scope", row.get("price_scope", "")),
                labeled("One-time", row.get("one_time_fees", "")),
                labeled("Notes", row.get("pricing_notes", "")),
                labeled("Confidence", row.get("pricing_confidence", "")),
            ],
            "",
        ) or '<span class="muted">Not public or not established</span>'
        scale = join_nonempty(
            [
                labeled(
                    "Market share",
                    join_nonempty(
                        [row.get("market_share_value", ""), row.get("market_share_unit", "")], " "
                    ),
                ),
                labeled("Share scope", row.get("market_share_scope", "")),
                labeled("Share period", row.get("market_share_period", "")),
                labeled("Share confidence", row.get("market_share_confidence", "")),
                labeled(
                    "Customer count",
                    join_nonempty(
                        [row.get("customer_count_value", ""), row.get("customer_count_scope", "")],
                        " ",
                    ),
                ),
                labeled("Count period", row.get("customer_count_period", "")),
                labeled("Count confidence", row.get("customer_count_confidence", "")),
                labeled("Named customers", row.get("notable_customers", "")),
            ],
            "",
        ) or '<span class="muted">No comparable scale figure established</span>'
        return [
            f'<strong>{esc(row.get("name") or row.get("product_name"))}</strong>'
            + labeled("Product", row.get("product_name", ""))
            + f'<span class="record-id">{esc(row.get("competitor_id", ""))}</span>',
            labeled("Owner", row.get("owner", ""))
            + labeled("Status", row.get("ownership_status", "")),
            labeled("Segment", row.get("target_segment", ""))
            + labeled("Positioning", row.get("positioning", ""))
            + labeled("Integrations", row.get("integrations", "")),
            price,
            scale,
            labeled("Strengths", row.get("strengths", ""))
            + labeled("Constraints", row.get("weaknesses", "")),
            source_links(row)
            + labeled("Verified", row.get("verification_status", ""))
            + labeled("As of", row.get("as_of_date", "")),
        ]

    def vendor(row: dict[str, str]) -> str:
        return " ".join(
            [row.get("name", ""), row.get("product_name", ""), row.get("owner", ""), row.get("vendor_id", "")]
        )

    return data_table(f"{domain_key}-competitors", "Competitor market map", columns, rows, cells, vendor)


def coverage_markup(value: str) -> str:
    key = {"✅": "yes", "partial": "partial", "❌": "no", "unknown": "unknown"}.get(
        value, "unknown"
    )
    label = {"✅": "Supported", "partial": "Partial", "❌": "Absent", "unknown": "Unknown"}.get(
        value, value or "Unknown"
    )
    return f'<span class="coverage coverage-{key}">{esc(value)} {esc(label)}</span>'


def render_features(
    domain_key: str, rows: list[dict[str, str]], names: dict[str, str], vendor_search: dict[str, str]
) -> str:
    columns = (
        ("product", "Product"),
        ("feature", "Feature"),
        ("coverage", "Coverage"),
        ("delivery", "Delivery"),
        ("availability", "Availability"),
        ("notes", "Notes"),
        ("evidence", "Evidence"),
    )

    def cells(row: dict[str, str]) -> list[str]:
        competitor = names.get(row.get("competitor_id", ""), row.get("competitor_id", ""))
        return [
            f"<strong>{esc(competitor)}</strong>"
            + f'<span class="record-id">{esc(row.get("competitor_id", ""))}</span>',
            f'<strong>{esc(row.get("feature_name", ""))}</strong>'
            + f'<span class="record-id">{esc(row.get("feature_id", ""))}</span>',
            coverage_markup(row.get("coverage", "")),
            labeled("Mode", row.get("delivery_mode", ""))
            + labeled("Plan/version", row.get("plan_or_version", "")),
            labeled("Status", row.get("availability", "")),
            esc(row.get("notes", "")) or '<span class="muted">No note recorded</span>',
            source_links(row)
            + labeled("Type", row.get("evidence_type", ""))
            + labeled("Confidence", row.get("confidence", ""))
            + labeled("Verified", row.get("verification_status", ""))
            + labeled("As of", row.get("as_of_date", "")),
        ]

    return data_table(
        f"{domain_key}-features",
        "Feature matrix — long-form evidence rows",
        columns,
        rows,
        cells,
        lambda row: vendor_search.get(row.get("competitor_id", ""), row.get("competitor_id", "")),
    )


def render_pains(domain_key: str, rows: list[dict[str, str]], names: dict[str, str], vendor_search: dict[str, str]) -> str:
    columns = (
        ("product", "Product"),
        ("workflow", "Workflow and reported pain"),
        ("people", "Affected context"),
        ("severity", "Severity"),
        ("context", "Evidence context"),
        ("limits", "Prevalence limits"),
        ("evidence", "Evidence"),
    )

    def cells(row: dict[str, str]) -> list[str]:
        competitor = names.get(row.get("competitor_id", ""), row.get("competitor_id", "")) or "Cross-market"
        severity = row.get("severity", "") or "unknown"
        return [
            f"<strong>{esc(competitor)}</strong>",
            labeled("Workflow", row.get("workflow", ""))
            + f'<span class="pain-text">{esc(row.get("pain_point", ""))}</span>',
            labeled("Role", row.get("affected_role", ""))
            + labeled("Segment", row.get("institution_segment", "")),
            f'<span class="severity severity-{slug(severity)}">{esc(severity.title())}</span>'
            + labeled("Rationale", row.get("severity_rationale", "")),
            labeled("Type", row.get("evidence_type", ""))
            + labeled("Reported", row.get("reported_date", ""))
            + labeled("Context", row.get("source_context", "")),
            esc(row.get("prevalence_limitations", "")),
            source_links(row)
            + labeled("Confidence", row.get("confidence", ""))
            + labeled("Verified", row.get("verification_status", ""))
            + labeled("As of", row.get("as_of_date", ""))
            + f'<span class="record-id">{esc(row.get("pain_id", ""))}</span>',
        ]

    return data_table(
        f"{domain_key}-pains",
        "Reported pain evidence",
        columns,
        rows,
        cells,
        lambda row: vendor_search.get(row.get("competitor_id", ""), row.get("competitor_id", "")),
    )


def render_generic_csv(table_id: str, caption: str, rows: list[dict[str, str]]) -> str:
    if not rows:
        return '<p class="empty-note">No records were present when the report was generated.</p>'
    keys = list(rows[0])
    columns = tuple((key, key.replace("_", " ").title()) for key in keys)

    def cells(row: dict[str, str]) -> list[str]:
        result: list[str] = []
        for key in keys:
            if key == "source_ids":
                result.append(source_links(row))
            elif key == "source_urls":
                result.append(
                    " ".join(
                        f'<a href="{esc(url)}" target="_blank" rel="noreferrer noopener">Source</a>'
                        for url in split_multi(row.get(key, ""))
                        if urlparse(url).scheme in {"http", "https"}
                    )
                )
            else:
                result.append(esc(row.get(key, "")))
        return result

    return data_table(table_id, caption, columns, rows, cells, None, vendor_aware=False)


def discover_domains(strict: bool) -> list[dict[str, object]]:
    domains: list[dict[str, object]] = []
    present_prefixes: set[str] = set()
    schemas = json.loads(read_text(SCHEMA_PATH))
    for path in sorted(RESEARCH_ROOT.iterdir()):
        match = DOMAIN_PATTERN.match(path.name) if path.is_dir() else None
        if not match:
            continue
        prefix, label = match.groups()
        files_present = [name for name in STANDARD_FILES if (path / name).is_file()]
        if not files_present:
            continue
        present_prefixes.add(prefix)
        missing = [name for name in STANDARD_FILES if not (path / name).is_file()]
        if strict and missing:
            raise FileNotFoundError(f"{path.name} is missing final files: {', '.join(missing)}")
        notes = read_text(path / "notes.md") if (path / "notes.md").is_file() else ""
        opportunities = read_text(path / "opportunities.md") if (path / "opportunities.md").is_file() else ""
        sources = read_text(path / "sources.md") if (path / "sources.md").is_file() else ""
        csv_data: dict[str, list[dict[str, str]]] = {}
        for stem in ("competitors", "feature_matrix", "pain_points"):
            csv_path = path / f"{stem}.csv"
            csv_data[stem] = read_csv(csv_path) if csv_path.is_file() else []
            if csv_path.is_file() and stem in schemas:
                with csv_path.open(encoding="utf-8-sig", newline="") as handle:
                    header = next(csv.reader(handle), [])
                if header != schemas[stem]:
                    message = f"Header mismatch in {csv_path.relative_to(RESEARCH_ROOT)}"
                    if strict:
                        raise ValueError(message)
                    print(f"warning: {message}", file=sys.stderr)
        supplemental: dict[str, list[dict[str, str]]] = {}
        for csv_path in sorted(path.glob("*.csv")):
            if csv_path.stem not in csv_data:
                supplemental[csv_path.name] = read_csv(csv_path)
        extra_markdown = []
        for md_path in sorted(path.glob("*.md")):
            if md_path.name not in {"notes.md", "opportunities.md", "sources.md"}:
                extra_markdown.append((md_path.name, read_text(md_path)))
        domains.append(
            {
                "path": path,
                "key": path.name,
                "prefix": prefix,
                "label": label,
                "title": title_from_notes(notes, label),
                "notes": notes,
                "opportunities": opportunities,
                "sources": sources,
                "missing": missing,
                "csv": csv_data,
                "supplemental": supplemental,
                "extra_markdown": extra_markdown,
            }
        )
    if strict:
        missing_prefixes = [f"0{number}" for number in range(1, 7) if f"0{number}" not in present_prefixes]
        if missing_prefixes:
            raise FileNotFoundError("Missing final domain prefixes: " + ", ".join(missing_prefixes))
    return domains


CSS = r"""
    :root {
      color-scheme: light;
      --canvas: #f4f6f9;
      --surface: #ffffff;
      --surface-raised: #f9fafc;
      --ink: #152033;
      --muted: #5b6678;
      --faint: #5b6678;
      --line: #dbe1ea;
      --line-strong: #b8c2d1;
      --control: #647184;
      --accent: #1768d5;
      --accent-soft: #e8f1ff;
      --on-accent: #ffffff;
      --focus: #005fcc;
      --success: #17683a;
      --success-soft: #e6f5ec;
      --warning: #825500;
      --warning-soft: #fff4d6;
      --danger: #a33131;
      --danger-soft: #fdeaea;
      --unknown: #536071;
      --unknown-soft: #edf0f4;
      --shadow: 0 1px 2px rgb(17 28 45 / .04), 0 10px 32px rgb(17 28 45 / .07);
      --radius: 14px;
      --radius-small: 9px;
      --gutter: clamp(1rem, 3vw, 2.5rem);
    }
    [data-theme="dark"] {
      color-scheme: dark;
      --canvas: #0d1219;
      --surface: #151b24;
      --surface-raised: #1a222d;
      --ink: #f3f6fa;
      --muted: #b3bdca;
      --faint: #8d99a9;
      --line: #303b49;
      --line-strong: #526174;
      --control: #8f9bad;
      --accent: #88b7ff;
      --accent-soft: #162d4d;
      --on-accent: #10213c;
      --focus: #9ec4ff;
      --success: #8ed7a9;
      --success-soft: #183728;
      --warning: #f3ca70;
      --warning-soft: #3b2d12;
      --danger: #ffabab;
      --danger-soft: #402122;
      --unknown: #c0c8d2;
      --unknown-soft: #28313d;
      --shadow: 0 1px 2px rgb(0 0 0 / .25), 0 12px 36px rgb(0 0 0 / .24);
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        color-scheme: dark;
        --canvas: #0d1219;
        --surface: #151b24;
        --surface-raised: #1a222d;
        --ink: #f3f6fa;
        --muted: #b3bdca;
        --faint: #8d99a9;
        --line: #303b49;
        --line-strong: #526174;
        --control: #8f9bad;
        --accent: #88b7ff;
        --accent-soft: #162d4d;
        --on-accent: #10213c;
        --focus: #9ec4ff;
        --success: #8ed7a9;
        --success-soft: #183728;
        --warning: #f3ca70;
        --warning-soft: #3b2d12;
        --danger: #ffabab;
        --danger-soft: #402122;
        --unknown: #c0c8d2;
        --unknown-soft: #28313d;
        --shadow: 0 1px 2px rgb(0 0 0 / .25), 0 12px 36px rgb(0 0 0 / .24);
      }
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 5.5rem; }
    body {
      margin: 0;
      background: var(--canvas);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
      font-size: 100%;
      line-height: 1.55;
      text-rendering: optimizeLegibility;
    }
    a { color: var(--accent); text-underline-offset: .18em; text-decoration-thickness: .08em; }
    a:hover { text-decoration-thickness: .13em; }
    button, input, summary { font: inherit; }
    button, input { min-height: 44px; }
    button:focus-visible, input:focus-visible, summary:focus-visible, a:focus-visible {
      outline: 3px solid var(--focus); outline-offset: 3px;
    }
    .skip-link {
      position: fixed; inset: .75rem auto auto .75rem; z-index: 100;
      transform: translateY(-160%); background: var(--ink); color: var(--surface);
      padding: .7rem 1rem; border-radius: var(--radius-small);
    }
    .skip-link:focus { transform: none; }
    .sr-only {
      position: absolute !important; width: 1px !important; height: 1px !important;
      padding: 0 !important; margin: -1px !important; overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important;
    }
    .report-layout { display: grid; min-height: 100vh; }
    .sidebar {
      display: none; position: sticky; inset-block-start: 0; height: 100vh;
      padding: 1.5rem 1.25rem; border-inline-end: 1px solid var(--line);
      background: var(--surface); overflow-y: auto;
    }
    .brand { display: flex; align-items: center; gap: .75rem; color: var(--ink); text-decoration: none; }
    .brand-mark {
      display: grid; place-items: center; width: 2rem; height: 2rem;
      border-radius: .62rem; background: var(--accent); color: var(--on-accent);
      font-size: .78rem; font-weight: 760; letter-spacing: -.03em;
    }
    .brand-copy { display: grid; line-height: 1.15; }
    .brand-copy strong { font-size: .96rem; letter-spacing: -.015em; }
    .brand-copy span { color: var(--muted); font-size: .78rem; }
    .side-nav { margin-block: 2rem; }
    .side-nav a {
      display: block; padding: .54rem .7rem .54rem 1rem; margin-block: .16rem;
      border-inline-start: 2px solid transparent; border-radius: 0 .5rem .5rem 0;
      color: var(--muted); text-decoration: none; font-size: .88rem;
    }
    .side-nav a:hover, .side-nav a[aria-current="true"] {
      color: var(--ink); background: var(--accent-soft); border-inline-start-color: var(--accent);
    }
    .side-note { color: var(--faint); font-size: .76rem; line-height: 1.45; }
    .mobile-bar {
      position: sticky; inset-block-start: 0; z-index: 50; display: flex;
      align-items: center; justify-content: space-between; gap: .75rem;
      min-height: 4rem; padding: .6rem var(--gutter); background: color-mix(in srgb, var(--surface) 94%, transparent);
      border-block-end: 1px solid var(--line); backdrop-filter: blur(14px);
    }
    .mobile-nav { position: relative; }
    .mobile-nav summary {
      list-style: none; cursor: pointer; padding: .62rem .78rem; border: 1px solid var(--line-strong);
      border-radius: var(--radius-small); background: var(--surface); font-weight: 650;
    }
    .mobile-nav summary::-webkit-details-marker { display: none; }
    .mobile-nav-panel {
      position: absolute; inset: calc(100% + .5rem) 0 auto auto; width: min(19rem, calc(100vw - 2rem));
      max-height: min(70vh, 34rem); overflow: auto; padding: .55rem;
      border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow);
    }
    .mobile-nav-panel a { display: block; padding: .72rem; border-radius: .5rem; text-decoration: none; color: var(--ink); }
    .mobile-nav-panel a:hover { background: var(--accent-soft); }
    .theme-button, .quiet-button {
      border: 1px solid var(--line-strong); border-radius: var(--radius-small);
      color: var(--ink); background: var(--surface); padding: .58rem .78rem; cursor: pointer;
    }
    .theme-button:hover, .quiet-button:hover { border-color: var(--accent); background: var(--accent-soft); }
    main { min-width: 0; }
    .hero {
      padding: clamp(3.5rem, 7vw, 7.5rem) var(--gutter) clamp(3rem, 6vw, 6rem);
      background: var(--surface); border-block-end: 1px solid var(--line);
    }
    .hero-inner, .section-inner { width: min(100%, 92rem); margin-inline: auto; }
    .hero-copy { max-width: 68rem; }
    .hero h1 {
      margin: 0; max-width: 18ch; font-size: clamp(2.55rem, 1.9rem + 3vw, 5rem);
      line-height: 1.02; letter-spacing: -.048em; text-wrap: balance;
    }
    .hero-lede { max-width: 62ch; margin-block: 1.5rem 0; color: var(--muted); font-size: clamp(1.08rem, 1rem + .35vw, 1.32rem); }
    .report-meta { display: flex; flex-wrap: wrap; gap: .55rem 1.3rem; margin-block-start: 1.5rem; color: var(--muted); font-size: .88rem; }
    .report-meta span { display: inline-flex; align-items: center; gap: .4rem; }
    .report-meta span::before { content: ""; width: .42rem; height: .42rem; border-radius: 50%; background: var(--accent); }
    .sample-panel { margin-block-start: clamp(2rem, 5vw, 4rem); border-block: 1px solid var(--line); padding-block: 1.5rem; }
    .sample-panel h2 { margin: 0 0 .25rem; font-size: 1rem; letter-spacing: -.01em; }
    .sample-panel > p { margin: 0 0 1.2rem; color: var(--muted); font-size: .84rem; }
    .sample-grid { display: grid; gap: .9rem; }
    .sample-row { display: grid; grid-template-columns: minmax(8rem, 1.2fr) 3fr auto; align-items: center; gap: .75rem; }
    .sample-row strong { font-size: .86rem; font-weight: 620; }
    .sample-track { height: .45rem; border-radius: 99px; background: var(--unknown-soft); overflow: hidden; }
    .sample-fill { display: block; height: 100%; background: var(--accent); border-radius: inherit; }
    .sample-count { color: var(--muted); font-size: .78rem; font-variant-numeric: tabular-nums; }
    .content-section { padding: clamp(3.5rem, 6vw, 6rem) var(--gutter); border-block-end: 1px solid var(--line); }
    .content-section:nth-of-type(even) { background: var(--surface); }
    .section-header { display: grid; gap: .65rem; max-width: 74rem; margin-block-end: 2.3rem; }
    .section-kicker { color: var(--accent); font-weight: 700; font-size: .84rem; }
    .section-header h2 { margin: 0; font-size: clamp(2rem, 1.6rem + 1.5vw, 3.1rem); line-height: 1.12; letter-spacing: -.035em; text-wrap: balance; }
    .section-header p { margin: 0; max-width: 68ch; color: var(--muted); font-size: 1.03rem; }
    .global-tools {
      display: grid; gap: .75rem; padding: 1.1rem; margin-block-end: 2.25rem;
      border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface-raised);
    }
    .global-tools label, .table-tools label { font-weight: 660; font-size: .88rem; }
    .global-tools p, .table-status { margin: 0; color: var(--muted); font-size: .8rem; }
    .search-row { display: flex; gap: .55rem; align-items: center; }
    input[type="search"] {
      width: min(100%, 32rem); padding: .62rem .8rem; border: 1px solid var(--control);
      border-radius: var(--radius-small); color: var(--ink); background: var(--surface);
    }
    .recommendation {
      margin-block: 0 2.5rem; padding: 1.25rem 1.4rem; border-inline-start: 4px solid var(--accent);
      background: var(--accent-soft); border-radius: 0 var(--radius-small) var(--radius-small) 0;
    }
    .recommendation h3 { margin-top: 0; }
    .subsection { margin-block: 3rem; }
    .subsection > h3 { margin: 0 0 1rem; font-size: 1.35rem; letter-spacing: -.018em; }
    .source-file-links { display: flex; flex-wrap: wrap; gap: .55rem; margin-block: 1rem 2rem; }
    .source-file-links a { padding: .45rem .65rem; border: 1px solid var(--line); border-radius: .48rem; background: var(--surface); font-size: .8rem; text-decoration: none; }
    details.reading { border-block-start: 1px solid var(--line); }
    details.reading > summary {
      cursor: pointer; min-height: 48px; padding-block: 1rem; color: var(--ink); font-weight: 680;
    }
    details.reading[open] > summary { color: var(--accent); }
    .prose { max-width: 76ch; font-size: 1rem; line-height: 1.7; }
    .prose.wide { max-width: none; }
    .prose h1 { font-size: 2rem; }
    .prose h2 { margin: 2.8rem 0 1rem; font-size: 1.65rem; line-height: 1.2; letter-spacing: -.025em; }
    .prose h3 { margin: 2rem 0 .7rem; font-size: 1.28rem; line-height: 1.28; letter-spacing: -.014em; }
    .prose h4 { margin: 1.6rem 0 .5rem; font-size: 1.08rem; }
    .prose p, .prose ul, .prose ol { margin-block: .7rem; }
    .prose li + li { margin-block-start: .4rem; }
    .prose blockquote { margin: 1rem 0; padding: .2rem 1rem; border-inline-start: 3px solid var(--line-strong); color: var(--muted); }
    .prose code, .record-id {
      font-family: ui-monospace, "SFMono-Regular", Consolas, monospace; font-size: .78rem;
    }
    pre { max-width: 100%; overflow: auto; padding: 1rem; background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-small); }
    .table-block { margin-block: 1rem 3rem; }
    .table-tools { display: grid; gap: .5rem; margin-block-end: .75rem; }
    .table-shell { max-width: 100%; overflow: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
    table { width: 100%; border-collapse: collapse; font-size: .84rem; }
    caption { padding: .9rem 1rem; text-align: left; color: var(--muted); font-weight: 680; border-block-end: 1px solid var(--line); }
    th { position: sticky; inset-block-start: 0; z-index: 1; min-width: 9rem; padding: 0; text-align: left; background: var(--surface-raised); border-block-end: 1px solid var(--line-strong); }
    th[aria-sort="ascending"], th[aria-sort="descending"] { background: var(--accent-soft); }
    .sort-button { width: 100%; min-height: 48px; display: flex; justify-content: space-between; gap: .5rem; align-items: center; padding: .7rem .8rem; border: 0; color: var(--ink); background: transparent; cursor: pointer; font-weight: 720; text-align: left; }
    td { min-width: 10rem; max-width: 28rem; vertical-align: top; padding: .75rem .8rem; border-block-end: 1px solid var(--line); overflow-wrap: anywhere; }
    tr:last-child td { border-block-end: 0; }
    tbody tr:hover { background: var(--surface-raised); }
    .markdown-table { margin-block: 1rem 1.5rem; }
    .markdown-table th { padding: .65rem .75rem; }
    .markdown-table td { max-width: 34rem; }
    .field { display: block; margin-block-start: .32rem; }
    .field-label { display: block; color: var(--faint); font-size: .7rem; font-weight: 700; }
    .record-id { display: block; margin-block-start: .45rem; color: var(--faint); }
    .source-links { display: flex; flex-wrap: wrap; gap: .32rem; }
    .source-links a { display: inline-block; padding: .18rem .38rem; border-radius: .34rem; background: var(--accent-soft); font-size: .72rem; font-weight: 680; text-decoration: none; }
    .coverage, .severity { display: inline-flex; align-items: center; padding: .28rem .48rem; border-radius: 99px; font-size: .75rem; font-weight: 720; white-space: nowrap; }
    .coverage-yes { color: var(--success); background: var(--success-soft); }
    .coverage-partial, .severity-medium { color: var(--warning); background: var(--warning-soft); }
    .coverage-no, .severity-high { color: var(--danger); background: var(--danger-soft); }
    .coverage-unknown, .severity-low, .severity-unknown { color: var(--unknown); background: var(--unknown-soft); }
    .pain-text { display: block; margin-block-start: .35rem; font-weight: 630; }
    .muted, .empty-note { color: var(--muted); }
    .missing-note { padding: .9rem 1rem; border: 1px solid var(--line); border-radius: var(--radius-small); color: var(--muted); background: var(--surface-raised); }
    .empty-row td { padding: 1.4rem; color: var(--muted); text-align: center; }
    .footer { padding: 2rem var(--gutter) 4rem; color: var(--muted); font-size: .82rem; background: var(--surface); }
    .footer-inner { width: min(100%, 92rem); margin-inline: auto; }
    @media (min-width: 45rem) {
      .sample-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 2rem; }
      .global-tools { grid-template-columns: minmax(12rem, 28rem) 1fr; align-items: end; }
      .global-tools p { padding-block-end: .7rem; }
    }
    @media (min-width: 65rem) {
      .report-layout { grid-template-columns: 17rem minmax(0, 1fr); }
      .sidebar { display: block; }
      .mobile-bar { display: none; }
      html { scroll-padding-top: 1rem; }
    }
    @media (max-width: 35rem) {
      .brand-copy span { display: none; }
      .sample-row { grid-template-columns: minmax(7rem, 1fr) 2fr; }
      .sample-count { grid-column: 2; }
      .search-row { align-items: stretch; }
      .search-row input { min-width: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
    }
    @media (prefers-reduced-transparency: reduce) {
      .mobile-bar { background: var(--surface); backdrop-filter: none; }
    }
    @media (forced-colors: active) {
      .coverage, .severity, .source-links a, .brand-mark { border: 1px solid ButtonText; }
      .sample-fill { background: Highlight; }
    }
    @media print {
      .sidebar, .mobile-bar, .table-tools, .global-tools, .theme-button { display: none !important; }
      .report-layout { display: block; }
      .content-section, .hero { padding: 1.5rem 0; break-inside: avoid-page; }
      .table-shell { overflow: visible; }
      table { font-size: 7pt; }
      a { color: inherit; }
    }
"""


JS = r"""
  (() => {
    'use strict';
    const root = document.documentElement;
    const themeButtons = [...document.querySelectorAll('[data-theme-toggle]')];
    const choices = ['system', 'light', 'dark'];
    let theme = 'system';
    try {
      const saved = localStorage.getItem('whiteboard-report-theme');
      if (choices.includes(saved)) theme = saved;
    } catch (_) {}

    function applyTheme() {
      if (theme === 'system') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', theme);
      const label = theme[0].toUpperCase() + theme.slice(1);
      themeButtons.forEach((button) => {
        button.textContent = 'Theme: ' + label;
        button.setAttribute('aria-label', 'Theme preference is ' + label + '. Activate to change it.');
      });
    }
    themeButtons.forEach((button) => button.addEventListener('click', () => {
      theme = choices[(choices.indexOf(theme) + 1) % choices.length];
      try { localStorage.setItem('whiteboard-report-theme', theme); } catch (_) {}
      applyTheme();
    }));
    applyTheme();

    const globalInput = document.querySelector('[data-global-vendor]');
    const globalClear = document.querySelector('[data-clear-global]');
    const tables = [...document.querySelectorAll('.data-table')];

    function normalized(value) { return (value || '').trim().toLocaleLowerCase(); }
    function applyFilter(table) {
      const localInput = document.getElementById(table.id + '-search');
      const local = normalized(localInput && localInput.value);
      const global = normalized(globalInput && globalInput.value);
      const rows = [...table.tBodies[0].rows].filter((row) => !row.classList.contains('empty-row'));
      let shown = 0;
      rows.forEach((row) => {
        const localMatch = !local || normalized(row.dataset.search).includes(local);
        const vendorMatch = table.dataset.vendorAware !== 'true' || !global || normalized(row.dataset.vendor).includes(global);
        row.hidden = !(localMatch && vendorMatch);
        if (!row.hidden) shown += 1;
      });
      const empty = table.tBodies[0].querySelector('.empty-row');
      if (empty) empty.hidden = shown !== 0;
      const status = document.getElementById(table.id + '-status');
      if (status) status.textContent = shown + ' of ' + rows.length + ' records shown.';
    }
    function applyAll() { tables.forEach(applyFilter); }
    document.querySelectorAll('[data-table-search]').forEach((input) => {
      input.addEventListener('input', () => {
        const table = document.getElementById(input.dataset.tableSearch);
        if (table) applyFilter(table);
      });
    });
    document.querySelectorAll('[data-clear-search]').forEach((button) => {
      button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.clearSearch + '-search');
        if (input) { input.value = ''; input.focus(); }
        const table = document.getElementById(button.dataset.clearSearch);
        if (table) applyFilter(table);
      });
    });
    if (globalInput) globalInput.addEventListener('input', applyAll);
    if (globalClear) globalClear.addEventListener('click', () => {
      if (globalInput) { globalInput.value = ''; globalInput.focus(); }
      applyAll();
    });

    document.querySelectorAll('.sort-button').forEach((button) => {
      button.addEventListener('click', () => {
        const table = button.closest('table');
        const th = button.closest('th');
        if (!table || !th || !table.tBodies.length) return;
        const index = [...th.parentElement.children].indexOf(th);
        const previous = th.getAttribute('aria-sort');
        const direction = previous === 'ascending' ? 'descending' : 'ascending';
        th.parentElement.querySelectorAll('th').forEach((cell) => cell.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', direction);
        const empty = table.tBodies[0].querySelector('.empty-row');
        const rows = [...table.tBodies[0].rows].filter((row) => row !== empty);
        rows.sort((a, b) => {
          const av = a.cells[index] ? a.cells[index].textContent.trim() : '';
          const bv = b.cells[index] ? b.cells[index].textContent.trim() : '';
          return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * (direction === 'ascending' ? 1 : -1);
        });
        rows.forEach((row) => table.tBodies[0].appendChild(row));
        if (empty) table.tBodies[0].appendChild(empty);
      });
    });

    document.querySelectorAll('.mobile-nav-panel a').forEach((link) => {
      link.addEventListener('click', () => {
        const details = link.closest('details');
        if (details) details.open = false;
      });
    });

    if ('IntersectionObserver' in window) {
      const links = [...document.querySelectorAll('.side-nav a[href^="#"]')];
      const byId = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        links.forEach((link) => link.removeAttribute('aria-current'));
        const active = byId.get(visible.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      }, { rootMargin: '-10% 0px -78% 0px', threshold: 0 });
      document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    }
    applyAll();
  })();
"""


def build_report(strict: bool = False) -> tuple[str, dict[str, object]]:
    domains = discover_domains(strict)
    synthesis_path = RESEARCH_ROOT / "synthesis.md"
    if strict and not synthesis_path.is_file():
        raise FileNotFoundError("research/synthesis.md is required in strict mode")
    synthesis = read_text(synthesis_path) if synthesis_path.is_file() else ""
    baseline_paths = [
        RESEARCH_ROOT / "00_baseline" / "current_build.md",
        RESEARCH_ROOT / "00_baseline" / "research_plan.md",
    ]
    if strict:
        for path in baseline_paths:
            if not path.is_file():
                raise FileNotFoundError(path)

    all_competitors = sum(len(domain["csv"]["competitors"]) for domain in domains)  # type: ignore[index]
    all_features = sum(len(domain["csv"]["feature_matrix"]) for domain in domains)  # type: ignore[index]
    all_pains = sum(len(domain["csv"]["pain_points"]) for domain in domains)  # type: ignore[index]
    source_ids: set[str] = set()
    vendor_names: set[str] = set()
    for domain in domains:
        csv_data = domain["csv"]  # type: ignore[assignment]
        for row in csv_data["competitors"]:  # type: ignore[index]
            vendor_names.update(
                value for value in [row.get("name", ""), row.get("product_name", ""), row.get("owner", "")] if value
            )
        for stem in ("competitors", "feature_matrix", "pain_points"):
            for row in csv_data[stem]:  # type: ignore[index]
                source_ids.update(split_multi(row.get("source_ids", "")))

    nav_items = [("executive-summary", "Executive summary")]
    nav_items.extend((f"domain-{domain['key']}", str(domain["title"])) for domain in domains)
    nav_items.extend([("synthesis", "Synthesis and roadmap"), ("sources", "Source registers")])
    nav_html = "".join(f'<a href="#{esc(anchor)}">{esc(label)}</a>' for anchor, label in nav_items)
    data_list = "".join(f'<option value="{esc(name)}"></option>' for name in sorted(vendor_names, key=str.casefold))

    sample_max = max([1] + [len(domain["csv"]["feature_matrix"]) for domain in domains])  # type: ignore[index]
    sample_rows = []
    for domain in domains:
        csv_data = domain["csv"]  # type: ignore[assignment]
        feature_count = len(csv_data["feature_matrix"])  # type: ignore[index]
        competitor_count = len(csv_data["competitors"])  # type: ignore[index]
        pain_count = len(csv_data["pain_points"])  # type: ignore[index]
        width = max(4, round(feature_count / sample_max * 100)) if feature_count else 0
        sample_rows.append(
            f'<div class="sample-row"><strong>{esc(domain["title"])}</strong>'
            f'<span class="sample-track" aria-hidden="true"><span class="sample-fill" style="width:{width}%"></span></span>'
            f'<span class="sample-count">{competitor_count} products · {feature_count} features · {pain_count} pain records</span></div>'
        )

    executive_md = extract_section(
        synthesis,
        ("Executive summary", "Decision summary", "Recommendation", "Recommended strategy"),
    )
    if executive_md:
        executive_html = MarkdownRenderer(RESEARCH_ROOT, "executive").render(executive_md)
    else:
        executive_html = (
            "<p>This report brings the reviewed market maps, workflow evidence, user pain, "
            "cross-cutting requirements and product recommendations into one offline decision artifact. "
            "Counts describe the research sample only; they are not estimates of market prevalence.</p>"
        )

    domain_sections: list[str] = []
    source_sections: list[str] = []
    for number, domain in enumerate(domains, 1):
        path: Path = domain["path"]  # type: ignore[assignment]
        key = str(domain["key"])
        title = str(domain["title"])
        notes = str(domain["notes"])
        opportunities = str(domain["opportunities"])
        sources = str(domain["sources"])
        csv_data = domain["csv"]  # type: ignore[assignment]
        competitors: list[dict[str, str]] = csv_data["competitors"]  # type: ignore[index]
        features: list[dict[str, str]] = csv_data["feature_matrix"]  # type: ignore[index]
        pains: list[dict[str, str]] = csv_data["pain_points"]  # type: ignore[index]
        names = {
            row.get("competitor_id", ""): row.get("product_name") or row.get("name") or row.get("competitor_id", "")
            for row in competitors
        }
        vendor_search = {
            row.get("competitor_id", ""): " ".join(row.get(field, "") for field in ("name", "product_name", "owner", "vendor_id", "competitor_id"))
            for row in competitors
        }
        recommendation_md = extract_section(
            notes,
            ("Product recommendation", "Recommendation", "MVP recommendation", "Recommended direction"),
        )
        recommendation = ""
        if recommendation_md:
            recommendation = (
                '<aside class="recommendation"><h3>Recommended direction</h3><div class="prose">'
                + MarkdownRenderer(path, f"{key}-recommendation").render(recommendation_md)
                + "</div></aside>"
            )
        missing = domain["missing"]  # type: ignore[assignment]
        missing_note = (
            '<p class="missing-note"><strong>Draft input:</strong> Files not yet present: '
            + esc(", ".join(missing))
            + ". Re-run the generator after research is complete.</p>"
            if missing
            else ""
        )
        source_files = []
        for file_name in STANDARD_FILES:
            if (path / file_name).is_file():
                relative = os.path.relpath(path / file_name, REPORT_DIR).replace(os.sep, "/")
                source_files.append(f'<a href="{esc(quote(relative, safe="/"))}">{esc(file_name)}</a>')
        notes_html = (
            MarkdownRenderer(path, f"{key}-notes").render(notes)
            if notes
            else '<p class="empty-note">Domain notes are not yet available.</p>'
        )
        opp_html = (
            MarkdownRenderer(path, f"{key}-opportunities").render(opportunities)
            if opportunities
            else '<p class="empty-note">Opportunity analysis is not yet available.</p>'
        )
        extra_sections = []
        for file_name, content in domain["extra_markdown"]:  # type: ignore[assignment]
            label = Path(file_name).stem.replace("_", " ").title()
            extra_sections.append(
                f'<details class="reading"><summary>{esc(label)}</summary>'
                f'<div class="prose wide">{MarkdownRenderer(path, f"{key}-{slug(file_name)}").render(content)}</div></details>'
            )
        supplemental_sections = []
        for file_name, rows in domain["supplemental"].items():  # type: ignore[union-attr]
            label = Path(file_name).stem.replace("_", " ").title()
            supplemental_sections.append(
                f'<div class="subsection"><h3>{esc(label)}</h3>'
                + render_generic_csv(f"{key}-{slug(file_name)}", label, rows)
                + "</div>"
            )
        domain_sections.append(
            f"""
            <section class="content-section" id="domain-{esc(key)}">
              <div class="section-inner">
                <header class="section-header">
                  <span class="section-kicker">Domain {number} of {len(domains)}</span>
                  <h2>{esc(title)}</h2>
                  <p>{len(competitors)} mapped products, {len(features)} feature evidence rows, and {len(pains)} reported pain records in this research sample.</p>
                </header>
                {missing_note}
                <nav class="source-file-links" aria-label="{esc(title)} source files">{''.join(source_files)}</nav>
                {recommendation}
                <div class="subsection"><h3>Market map</h3>{render_competitors(key, competitors) if competitors else '<p class="empty-note">No competitor records are available yet.</p>'}</div>
                <div class="subsection"><h3>Feature matrix</h3>{render_features(key, features, names, vendor_search) if features else '<p class="empty-note">No feature records are available yet.</p>'}</div>
                <div class="subsection"><h3>Reported pain</h3>{render_pains(key, pains, names, vendor_search) if pains else '<p class="empty-note">No pain records are available yet.</p>'}</div>
                {''.join(supplemental_sections)}
                <div class="subsection"><h3>Research analysis</h3><details class="reading" open><summary>Read the complete domain notes</summary><div class="prose wide">{notes_html}</div></details></div>
                <div class="subsection"><h3>Opportunities</h3><details class="reading" open><summary>Read the complete opportunity analysis</summary><div class="prose wide">{opp_html}</div></details></div>
                {''.join(extra_sections)}
              </div>
            </section>
            """
        )
        if sources:
            source_sections.append(
                f'<details class="reading"><summary>{esc(title)} source register</summary>'
                f'<div class="prose wide">{MarkdownRenderer(path, f"{key}-sources").render(sources)}</div></details>'
            )

    baseline_sections = []
    for path in baseline_paths:
        if path.is_file():
            baseline_sections.append(
                f'<details class="reading"><summary>{esc(path.stem.replace("_", " ").title())}</summary>'
                f'<div class="prose wide">{MarkdownRenderer(path.parent, f"baseline-{slug(path.stem)}").render(read_text(path))}</div></details>'
            )
    synthesis_html = (
        MarkdownRenderer(RESEARCH_ROOT, "synthesis-content").render(synthesis)
        if synthesis
        else '<p class="missing-note"><strong>Draft input:</strong> synthesis.md was not present. Re-run this generator after synthesis is complete.</p>'
    )
    generated = dt.date.today().isoformat()
    html_document = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="description" content="Whiteboard higher-education market and product research report">
  <title>Whiteboard research report</title>
  <style>{CSS}</style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to report</a>
  <div class="report-layout">
    <aside class="sidebar" aria-label="Report navigation">
      <a class="brand" href="#executive-summary"><span class="brand-mark" aria-hidden="true">W</span><span class="brand-copy"><strong>Whiteboard</strong><span>Research dossier</span></span></a>
      <nav class="side-nav">{nav_html}</nav>
      <button class="theme-button" type="button" data-theme-toggle>Theme: System</button>
      <p class="side-note">All counts describe the reviewed sample. Open source links to inspect the underlying evidence and limitations.</p>
    </aside>
    <main id="main">
      <div class="mobile-bar">
        <a class="brand" href="#executive-summary"><span class="brand-mark" aria-hidden="true">W</span><span class="brand-copy"><strong>Whiteboard</strong><span>Research dossier</span></span></a>
        <button class="theme-button" type="button" data-theme-toggle>Theme: System</button>
        <details class="mobile-nav"><summary>Sections</summary><nav class="mobile-nav-panel" aria-label="Mobile report navigation">{nav_html}</nav></details>
      </div>
      <section class="hero" id="executive-summary">
        <div class="hero-inner">
          <div class="hero-copy">
            <h1>Where Whiteboard can earn a place on campus</h1>
            <p class="hero-lede">A source-traceable review of higher-education platforms, daily workflows, switching constraints, and the narrowest credible launch path.</p>
            <div class="report-meta">
              <span>Research as of 15 October 2026</span>
              <span>{len(domains)} domains in this build</span>
              <span>{all_competitors} product records</span>
              <span>{len(source_ids)} cited source IDs</span>
            </div>
          </div>
          <div class="sample-panel" aria-labelledby="sample-title">
            <h2 id="sample-title">Research sample coverage</h2>
            <p>Bar length reflects feature rows reviewed, not adoption, quality, or market prevalence.</p>
            <div class="sample-grid">{''.join(sample_rows)}</div>
          </div>
        </div>
      </section>
      <section class="content-section" aria-labelledby="summary-title">
        <div class="section-inner">
          <header class="section-header"><span class="section-kicker">Decision context</span><h2 id="summary-title">Executive summary</h2></header>
          <div class="prose">{executive_html}</div>
          <div class="global-tools">
            <div><label for="global-vendor">Filter vendor-linked evidence</label><div class="search-row"><input id="global-vendor" type="search" list="vendor-list" data-global-vendor placeholder="Vendor, product, or owner"><button class="quiet-button" type="button" data-clear-global>Clear</button></div><datalist id="vendor-list">{data_list}</datalist></div>
            <p>The global filter applies to competitor, feature, and pain tables. Domain-only requirements and priority tables remain visible.</p>
          </div>
          <details class="reading"><summary>Baseline and research method</summary><div class="prose wide">{''.join(baseline_sections)}</div></details>
        </div>
      </section>
      {''.join(domain_sections)}
      <section class="content-section" id="synthesis">
        <div class="section-inner">
          <header class="section-header"><span class="section-kicker">Portfolio decision</span><h2>Synthesis and roadmap</h2><p>The consolidated launch wedge, positioning, sequence, purchasing gates, counterarguments, and open risks.</p></header>
          <div class="source-file-links">{'<a href="../synthesis.md">synthesis.md</a>' if synthesis else ''}</div>
          <div class="prose wide">{synthesis_html}</div>
        </div>
      </section>
      <section class="content-section" id="sources">
        <div class="section-inner">
          <header class="section-header"><span class="section-kicker">Evidence ledger</span><h2>Source registers</h2><p>Open every domain register in place. Each register records what a source supports and where its evidence stops.</p></header>
          {''.join(source_sections) if source_sections else '<p class="empty-note">No source registers were available.</p>'}
        </div>
      </section>
      <footer class="footer"><div class="footer-inner">Generated {esc(generated)} from local research files. The report contains no remote scripts, fonts, stylesheets, or runtime data requests.</div></footer>
    </main>
  </div>
  <script>{JS}</script>
</body>
</html>
"""
    stats = {
        "domains": len(domains),
        "competitors": all_competitors,
        "feature_rows": all_features,
        "pain_points": all_pains,
        "source_ids": len(source_ids),
        "strict": strict,
    }
    return html_document, stats


def validate_html(document: str, strict: bool) -> list[str]:
    warnings: list[str] = []
    forbidden = {
        "external script": r"<script\b[^>]*\bsrc\s*=",
        "external stylesheet": r"<link\b[^>]*\brel\s*=\s*[\"']?stylesheet",
        "runtime fetch": r"\bfetch\s*\(",
        "remote CSS import": r"@import\s+",
        "remote CSS asset": r"url\(\s*[\"']?https?://",
    }
    for label, pattern in forbidden.items():
        if re.search(pattern, document, re.I):
            raise ValueError(f"Report contains forbidden {label}")
    ids = re.findall(r'\bid="([^"]+)"', document)
    duplicates = sorted(value for value, count in Counter(ids).items() if count > 1)
    if duplicates:
        raise ValueError("Duplicate HTML ids: " + ", ".join(duplicates[:10]))
    id_set = set(ids)
    broken = sorted(
        href
        for href in re.findall(r'href="#([^"]+)"', document)
        if href and href not in id_set
    )
    if broken:
        raise ValueError("Broken internal anchors: " + ", ".join(broken[:10]))
    for required in ("main", "executive-summary", "synthesis", "sources"):
        if required not in id_set:
            raise ValueError(f"Missing required report section: {required}")
    if "No records match the current filters." not in document:
        warnings.append("No searchable tables were generated.")
    if strict and "Draft input:" in document:
        raise ValueError("Strict report still contains draft-input notices")
    return warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Require all six domain folders, their six standard files, and synthesis.md.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate inputs and generated HTML without writing report/index.html.",
    )
    args = parser.parse_args()
    document, stats = build_report(strict=args.strict)
    warnings = validate_html(document, strict=args.strict)
    if not args.check:
        REPORT_DIR.mkdir(parents=True, exist_ok=True)
        REPORT_PATH.write_text(document, encoding="utf-8")
    result = {
        "output": str(REPORT_PATH.relative_to(RESEARCH_ROOT)),
        "written": not args.check,
        "bytes": len(document.encode("utf-8")),
        **stats,
        "warnings": warnings,
    }
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
