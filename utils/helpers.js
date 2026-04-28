export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str, length = 24) {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

export function copyToClipboard(text) {
  if (typeof window === 'undefined') return;
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}
