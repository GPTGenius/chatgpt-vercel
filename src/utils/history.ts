export const writeHistory = () => {
  if (!window.location.pathname.endsWith('?')) {
    window.history.pushState({}, window.document.title, '?');
  }
};
