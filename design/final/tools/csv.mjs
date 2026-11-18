// Minimal RFC 4180 CSV reader and writer for the design/final trackers. No dependencies.
// Quoted fields may hold commas, quotes ("" escape) and newlines (LF or CRLF, preserved). CRLF outside quotes ends a record. Output uses LF line endings and a header row.
// Multi-value cells are joined with ";" and no spaces (see joinList / splitList / splitRefs).

export function parseCsv(text) {
  const records = readRecords(text);
  if (!records.length) return { columns: [], rows: [] };
  const [columns, ...body] = records;
  const rows = body.map((cells, i) => {
    if (cells.length !== columns.length) throw new Error(`csv: record ${i + 2} has ${cells.length} fields, expected ${columns.length}`);
    return Object.freeze(Object.fromEntries(columns.map((c, j) => [c, cells[j]])));
  });
  return { columns, rows };
}

function readRecords(text) {
  const records = [];
  let record = [], field = "", quoted = false, started = false, i = 0;
  while (i < text.length) {
    const ch = text[i];
    started = true;
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (ch === '"') { quoted = false; i += 1; continue; }
      field += ch; i += 1; continue;
    }
    if (ch === '"' && field === "") { quoted = true; i += 1; continue; }
    if (ch === ",") { record = [...record, field]; field = ""; i += 1; continue; }
    if (ch === "\r" && text[i + 1] === "\n") { records.push([...record, field]); record = []; field = ""; started = false; i += 2; continue; }
    if (ch === "\n") { records.push([...record, field]); record = []; field = ""; started = false; i += 1; continue; }
    field += ch; i += 1;
  }
  if (quoted) throw new Error("csv: unterminated quoted field");
  // "started" tracks a record in progress apart from its value, so a final quoted empty field ("") still counts.
  if (started) records.push([...record, field]);
  return records;
}

const needsQuotes = (v) => /[",\n\r]/.test(v);
const cell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return needsQuotes(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows, columns) {
  const lines = [columns.map(cell).join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))];
  return lines.join("\n") + "\n";
}

export const joinList = (values) => [...values].join(";");
export const splitList = (value) => (value ? value.split(";").filter(Boolean) : []);
// Like splitList but keeps empty tokens, so ";" or "BD9;" can be reported instead of silently dropped. A blank cell is [].
export const splitRefs = (value) => (value && value.trim() ? value.split(";").map((t) => t.trim()) : []);
