const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const htmlTags = /<[^>]*>/g;

export function normalizePlainText(value: string) {
  return value
    .normalize('NFKC')
    .replace(controlCharacters, '')
    .replace(htmlTags, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeMultilineText(value: string) {
  return value
    .normalize('NFKC')
    .replace(controlCharacters, '')
    .replace(htmlTags, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}
