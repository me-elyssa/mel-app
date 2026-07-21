// Utilitários para reconhecer links do Google Drive e montar a miniatura pública
// do arquivo. Não usa API key nem backend: o Drive expõe uma URL de thumbnail
// pública para qualquer arquivo compartilhado como "Qualquer pessoa com o link".

const DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
  /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
  /docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/,
];

export function isGoogleDriveUrl(url: string): boolean {
  return /(drive|docs)\.google\.com/.test(url);
}

export function extractDriveFileId(url: string): string | null {
  for (const pattern of DRIVE_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// URL pública de miniatura do Drive — funciona para qualquer arquivo
// compartilhado como "Qualquer pessoa com o link", sem API key.
export function driveThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
}
