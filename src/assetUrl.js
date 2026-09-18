// Keep local previews and GitHub Pages project subdirectories working alike.
export function assetUrl(value) {
  return value.replace(/(^|,\s*)\/(images|videos|proposals|pdfjs)\//g, (_, prefix, folder) => `${prefix}${import.meta.env.BASE_URL}${folder}/`);
}

export function resolveProjectAssets(value) {
  if (typeof value === 'string') return assetUrl(value);
  if (Array.isArray(value)) return value.map(resolveProjectAssets);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveProjectAssets(item)]));
  return value;
}
