// Gera uma miniatura (dataURL) do PRIMEIRO slide/página de um PDF usando pdfjs-dist
// Requisitos: npm i pdfjs-dist
// Importação moderna compatível com Vite/React

export async function generatePdfThumbnail(pdfUrl: string, maxWidth = 800): Promise<string | null> {
  try {
    // Importação correta para pdfjs-dist moderno
    const pdfjsLib = await import("pdfjs-dist");
    
    // Configurar worker com CDN (solução mais confiável)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.min.mjs`;

    const loadingTask = pdfjsLib.getDocument({ 
      url: pdfUrl, 
      withCredentials: true 
    });
    
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
    await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise;

    // Retorna dataURL para <img src="..." />
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  } catch (e) {
    console.error("Erro ao gerar thumbnail do PDF:", e);
    return null;
  }
}