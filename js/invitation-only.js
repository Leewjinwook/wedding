import { CONFIG } from './config.js';
import { buildInvitation } from './invitation.js';
import { PhotoGallery } from './gallery.js';
import { WeddingAudio } from './audio.js';

const gallery = new PhotoGallery();
buildInvitation(() => {}, gallery);
document.getElementById('replay').remove();
document.querySelector('.symbolic').remove();
document.getElementById('close-gallery').setAttribute('aria-label', '사진첩 닫기');
const stopAuto = gallery.stopAuto.bind(gallery);
gallery.stopAuto = () => {
  stopAuto();
  document.getElementById('gallery-auto-note').textContent = '좌우로 넘겨 보세요 · 사진은 전체 비율로 표시됩니다.';
};

const audio = new WeddingAudio();
const sound = document.createElement('button');
sound.type = 'button';
sound.className = 'outline';
sound.id = 'invite-sound';
const updateSound = () => {
  sound.textContent = audio.isPlaying ? '♪ 음악 끄기' : '♪ 음악 켜기';
  sound.setAttribute('aria-pressed', String(audio.isPlaying));
};
audio.onStateChange = updateSound;
sound.addEventListener('click', () => audio.setEnabled(!audio.isPlaying));
document.querySelector('.closing-controls').append(sound);
updateSound();
audio.setEnabled(Boolean(CONFIG.music.autoplay));
const resumeMusic = event => {
  if (event.target.closest('#invite-sound')) return;
  if (audio.enabled) audio.start();
};
document.addEventListener('pointerdown', resumeMusic);
document.addEventListener('keydown', resumeMusic);
document.title = `${CONFIG.groom} ♥ ${CONFIG.bride} 결혼합니다`;
import('./wedding-social.js').catch(error => console.error('Wedding forms could not load', error));
