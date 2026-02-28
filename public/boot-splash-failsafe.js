setTimeout(() => {
  const splash = document.getElementById('boot-splash');
  if (splash) {
    console.warn('Anchor OS: Forced boot-splash removal (failsafe trigger)');
    splash.style.transition = 'opacity 0.5s ease-out';
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 500);
  }
}, 4000);
