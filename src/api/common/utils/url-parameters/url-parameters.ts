/**
 * Extracts query parameters from a URL string
 * @param url The URL to parse
 * @returns An object containing the query parameters, or null if the URL is null
 */
export function getUrlParameters(
  url: string | null
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }

  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params: { [k: string]: string } = {};
  let match;

  while ((match = regex.exec(url))) {
    if (match[1] !== null) {
      params[match[1]] = match[2];
    }
  }

  return params;
}
