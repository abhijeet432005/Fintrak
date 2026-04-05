export const exportToCSV = (transactions, filename = "transactions") => {
    if (!Array.isArray(transactions) || transactions.length === 0) return;

    const headers = ["ID", "Type", "Category", "Amount", "Date", "Description"];

    const escapeCell = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).trim();
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const formatCSVDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    // Sort latest first — non-mutating
    const sorted = [...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const rows = sorted.map((t) => [
        t.id ?? "",
        t.type ?? "",
        t.category ?? "",
        typeof t.amount === "number" ? t.amount : (parseFloat(t.amount) || 0),
        formatCSVDate(t.date),
        t.description ?? "",
    ]);

    const csvContent =
        "\uFEFF" +
        [headers, ...rows]
            .map((row) => row.map(escapeCell).join(","))
            .join("\r\n");

    try {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        if (window.navigator?.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `${filename}.csv`);
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.csv`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
        console.error("CSV export failed:", err);
    }
};