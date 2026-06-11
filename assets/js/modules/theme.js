const KEY  = 'st-theme';
const html = document.documentElement;

function apply(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(KEY, theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.setAttribute('aria-label', theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro');
}

export function initTheme() {
  apply(localStorage.getItem(KEY) || 'light');

  document.getElementById('themeBtn').addEventListener('click', () => {
    apply(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
}
