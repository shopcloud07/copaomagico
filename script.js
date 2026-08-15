let carrIndex = 0;
const carrTotal = 6;
let carrInterval = null;

function atualizarCarrossel() {
  const track = document.getElementById('carrosselTrack');

  if (!track) return;

  track.style.transform = `translateX(-${carrIndex * 100}%)`;

  document.querySelectorAll('.carr-dot').forEach((dot, index) => {
    dot.classList.toggle('ativo', index === carrIndex);
  });
}

function moverCarrossel(dir) {
  carrIndex = (carrIndex + dir + carrTotal) % carrTotal;
  atualizarCarrossel();
}

function irParaSlide(index) {
  carrIndex = index;
  atualizarCarrossel();
}

function iniciarCarrossel() {
  if (carrInterval) return;

  carrInterval = setInterval(() => {
    moverCarrossel(1);
  }, 3200);
}

function iniciarSwipeCarrossel() {
  const track = document.getElementById('carrosselTrack');

  if (!track) return;

  let startX = 0;

  track.addEventListener('touchstart', function (event) {
    if (!event.touches || !event.touches.length) return;
    startX = event.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;

    const diff = startX - event.changedTouches[0].clientX;

    if (Math.abs(diff) > 40) {
      moverCarrossel(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

function iniciarTimer() {
  const KEY = 'timer_end_drinks';
  const barEl = document.getElementById('bar-timer');

  if (!barEl) return;

  let end = parseInt(sessionStorage.getItem(KEY), 10);

  if (!end || end < Date.now()) {
    end = Date.now() + (9 * 60 + 57) * 1000;
    sessionStorage.setItem(KEY, String(end));
  }

  function tick() {
    const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    barEl.textContent =
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    if (diff <= 0) {
      clearInterval(interval);
      barEl.textContent = '00:00';
    }
  }

  tick();

  const interval = setInterval(tick, 1000);
}

function toggleFaq(btn) {
  if (!btn) return;

  const item = btn.parentElement;

  if (!item) return;

  const aberto = item.classList.contains('aberto');

  document.querySelectorAll('.faq-item').forEach((faqItem) => {
    faqItem.classList.remove('aberto');
  });

  if (!aberto) {
    item.classList.add('aberto');
  }
}

function abrirPopup() {
  const overlay = document.getElementById('popup-overlay');

  if (!overlay) return;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharPopup() {
  const overlay = document.getElementById('popup-overlay');

  if (!overlay) return;

  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function irParaBasico() {
  fecharPopup();
  window.location.href = 'https://tilimcheckout.com/checkout?p=5de1d89610fb23a0cb27a602fda26764';
}

function configurarPopup() {
  const overlay = document.getElementById('popup-overlay');

  if (!overlay) return;

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      fecharPopup();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      fecharPopup();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  atualizarCarrossel();
  iniciarSwipeCarrossel();
  iniciarTimer();
  configurarPopup();
});

window.addEventListener('load', function () {
  iniciarCarrossel();
});

function ativarVideoComSom() {
  const video = document.getElementById('main-video');
  const playBtn = document.getElementById('video-play-btn');

  if (!video) return;

  video.muted = false;
  video.controls = false;
  video.play();

  if (playBtn) {
    playBtn.classList.add('oculto');
  }
}