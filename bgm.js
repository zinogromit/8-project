/* Homepage background music. Audible autoplay may need a user gesture. */
(() => {
  'use strict';
  const audio = document.querySelector('#site-bgm');
  const toggle = document.querySelector('#bgm-toggle');
  const toggleText = document.querySelector('#bgm-toggle-text');
  const volume = document.querySelector('#bgm-volume');
  const volumeValue = document.querySelector('#bgm-volume-value');
  if (!audio || !toggle || !volume) return;

  const KEY = 'icon-cafe-bgm-v1';
  let enabled = true;
  let level = 30;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      enabled = saved.enabled !== false;
      if (Number.isFinite(saved.volume)) level = Math.max(0, Math.min(100, saved.volume));
    }
  } catch {}

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({enabled, volume: level})); } catch {} };
  const update = () => {
    const playing = !audio.paused;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? '배경음악 끄기' : '배경음악 재생');
    toggleText.textContent = playing ? '음악 끄기' : '음악 켜기';
    toggle.querySelector('.bgm-icon').textContent = playing ? '♫' : '♪';
    volumeValue.value = `${level}%`;
    volume.setAttribute('aria-valuetext', `${level}%`);
  };
  const play = () => {
    if (!enabled || !audio.paused) return;
    const result = audio.play();
    if (result?.catch) result.catch(() => update());
  };

  audio.volume = level / 100;
  volume.value = level;
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('error', update);
  toggle.addEventListener('click', () => {
    if (audio.paused) { enabled = true; save(); play(); }
    else { enabled = false; audio.pause(); save(); }
    update();
  });
  volume.addEventListener('input', () => {
    level = Math.max(0, Math.min(100, volume.valueAsNumber));
    audio.volume = level / 100;
    save(); update();
    if (enabled) play();
  });
  const resume = event => {
    if (event.target.closest?.('.bgm-player')) return;
    if (enabled && audio.paused && !audio.error) play();
  };
  document.addEventListener('pointerdown', resume, {passive: true});
  document.addEventListener('keydown', resume);
  window.addEventListener('storage', event => {
    if (event.key !== KEY) return;
    try {
      const saved = JSON.parse(event.newValue || 'null');
      if (!saved) return;
      enabled = saved.enabled !== false;
      level = Number.isFinite(saved.volume) ? Math.max(0, Math.min(100, saved.volume)) : level;
      volume.value = level;
      audio.volume = level / 100;
      if (enabled) play(); else audio.pause();
      update();
    } catch {}
  });

  update();
  play();
})();

