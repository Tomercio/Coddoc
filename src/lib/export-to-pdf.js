import html2pdf from "html2pdf.js";

/**
 * Export a DOM element to a high-quality PDF.
 *
 * @param {HTMLElement} element    – The node to export
 * @param {Object}      opts       – Options
 * @param {string}      opts.filename     – Base name (no “.pdf”), default “document”
 * @param {number|number[]} opts.margin    – Page margins in mm, default 10
 * @param {Object}      opts.html2canvas  – html2canvas options (we bump `scale`)
 * @param {Object}      opts.jsPDF        – jsPDF options (unit, format, orientation)
 * @param {Object}      opts.image        – image options (type, quality)
 */
export function exportToPDF(element, opts = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new Error("exportToPDF: please pass a DOM element");
  }

  const {
    filename = "document",
    margin = 10,
    html2canvas = { scale: window.devicePixelRatio * 3, useCORS: true },
    jsPDF = { unit: "mm", format: "a4", orientation: "portrait" },
    image = { type: "jpeg", quality: 0.98 },
  } = opts;

  html2pdf()
    .set({
      margin,
      filename: `${filename.replace(/\s+/g, "_")}.pdf`,
      image,
      html2canvas,
      jsPDF,
      autoPaging: true,
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save()
    .catch((err) => {
      console.error("exportToPDF failed:", err);
      throw err;
    });
}
