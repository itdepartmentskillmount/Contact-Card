const PROFILE_BASE_DOMAIN = 'skillmount.com';

function isSubdomainProfileHost() {
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith('.' + PROFILE_BASE_DOMAIN)) return false;
  const subdomain = hostname.slice(0, -(PROFILE_BASE_DOMAIN.length + 1));
  const label = subdomain.split('.').pop();
  return Boolean(label && label !== 'www');
}

function getUsernameFromUrl() {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.endsWith('.' + PROFILE_BASE_DOMAIN)) {
    const subdomain = hostname.slice(0, -(PROFILE_BASE_DOMAIN.length + 1));
    const label = subdomain.split('.').pop();
    if (label && label !== 'www') return label;
  }

  const params = new URLSearchParams(window.location.search);
  const explicit = params.get('username');
  if (explicit) return explicit;

  const raw = window.location.search.replace(/^\?/, '').trim();
  if (!raw || raw.includes('=')) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function profileUrl(path, username) {
  if (isSubdomainProfileHost()) return path;

  const resolvedUsername = username || getUsernameFromUrl();
  if (!resolvedUsername) return path;

  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}username=${encodeURIComponent(resolvedUsername)}`;
}

function notFoundUrl(basePath, username) {
  if (!username) return basePath;
  const separator = basePath.includes('?') ? '&' : '?';
  return `${basePath}${separator}username=${encodeURIComponent(username)}`;
}
