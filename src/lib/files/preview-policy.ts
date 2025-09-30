export function isMimePreviewable(mimeType: string | undefined | null): boolean {
  if (!mimeType) return false;
  if (mimeType.startsWith("image/")) return true;
  if (mimeType === "application/pdf") return true;
  return false;
}