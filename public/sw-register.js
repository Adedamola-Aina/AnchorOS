if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=1.7.3').catch((error) => {
      console.warn('SW registration failed:', error);
    });
  });
}
