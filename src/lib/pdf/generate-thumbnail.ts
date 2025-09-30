// Gera uma miniatura (dataURL) do PRIMEIRO slide/página de um PDF usando pdfjs-dist
// Requisitos: npm i pdfjs-dist
// Observação: compatível com ESM. O Lovable deve suportar import.meta.url.

export async function generatePdfThumbnail(pdfUrl: string, maxWidth = 800): Promise<string | null> {
  try {
    const pdfjs = await import("pdfjs-dist/build/pdf");
    // workerSrc para ESM (pdfjs v3+)
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    // @ts-ignore
    const loadingTask = pdfjs.getDocument({ url: pdfUrl, withCredentials: true });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(maxWidth / viewport.width, 2); // limita qualidade
    const scaled = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = Math.floor(scaled.width);
    canvas.height = Math.floor(scaled.height);

    // Render
    await page.render({ canvasContext: ctx, viewport: scaled }).promise;

    // Retorna dataURL para <img src="..." />
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  } catch (e) {
    console.error("Erro ao gerar thumbnail do PDF:", e);
    return null;
  }
}