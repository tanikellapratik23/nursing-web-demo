export function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "No records\r\n";
  const keys = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    let s = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(s) || /^[\t\r\n]/.test(s))
      s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  return [
    keys.map(escape).join(","),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(",")),
  ].join("\r\n");
}
export function download(rows: object[], name: string) {
  const url = URL.createObjectURL(
    new Blob([csv(rows as Record<string, unknown>[])], {
      type: "text/csv;charset=utf-8;",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
