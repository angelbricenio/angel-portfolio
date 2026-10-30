/**
 * Turn a filename or folder slug into a readable title.
 * e.g. "church_photo" → "Church Photo", "eastb (2).png" → "Eastb (2)"
 */
export function filenameToTitle(name) {
  if (!name) return 'Untitled';
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return base
    .split(' ')
    .map((word) => {
      if (!word) return word;
      if (/^\d+$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** Last path segment from a Vite module path or URL path. */
export function basename(path) {
  if (!path) return '';
  const clean = path.split('?')[0].replace(/\\/g, '/');
  const parts = clean.split('/');
  return parts[parts.length - 1] || '';
}

/** Parent folder name for a work asset path (or '' if file is at work root). */
export function workFolder(path) {
  const clean = path.split('?')[0].replace(/\\/g, '/');
  const marker = '/work/';
  const idx = clean.toLowerCase().lastIndexOf(marker);
  if (idx === -1) return '';
  const rest = clean.slice(idx + marker.length);
  const parts = rest.split('/').filter(Boolean);
  if (parts.length <= 1) return '';
  return parts[0];
}
