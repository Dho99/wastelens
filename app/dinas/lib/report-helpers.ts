export function shortReportId(id: string) {
    if (/^LPR-\d+$/i.test(id)) return id.toUpperCase();
    return `WL-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

export function wasteTypeLabel(value: string) {
    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
