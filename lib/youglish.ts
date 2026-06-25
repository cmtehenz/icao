/** URL do YouGlish para ouvir nativos pronunciando a palavra */
export function youGlishUrl(word: string): string {
  const slug = encodeURIComponent(word.trim().toLowerCase());
  return `https://pt.youglish.com/pronounce/${slug}/english`;
}
