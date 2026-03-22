if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=1.15.0-rc.8').catch((error) => {
      console.warn('SW registration failed:', error);
    });
  });
}
