const timerDisplay = document.getElementById('timerDisplay');
const timerCard = document.getElementById('timerCard');
const progressFill = document.getElementById('progressFill');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.getElementById('statusText');
const modeLabel = document.getElementById('modeLabel');
const timerCaption = document.getElementById('timerCaption');
const soundName = document.getElementById('soundName');
const sessionCount = document.getElementById('sessionCount');
const focusToggle = document.getElementById('focusToggle');
const shakeToggle = document.getElementById('shakeToggle');

let selectedMinutes = 25;
let secondsRemaining = selectedMinutes * 60;
let totalSeconds = secondsRemaining;
let intervalId = null;
let timerDeadline = null;
let selectedSound = 'chime';
let customSoundUrl = null;
let completedSessions = 0;

const sounds = {
  chime: [660, 880],
  pulse: [440, 440, 660],
  bell: [523, 659, 784]
};

function formatTime(total) {
  const minutes = Math.floor(total / 60).toString().padStart(2, '0');
  const seconds = (total % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function render() {
  timerDisplay.textContent = formatTime(secondsRemaining);
  progressFill.style.width = `${Math.max(0, Math.min(100, ((totalSeconds - secondsRemaining) / totalSeconds) * 100))}%`;
  startButton.querySelector('span:last-child').textContent = intervalId ? 'Pause timer' : 'Start focus';
  startButton.querySelector('.button-icon').textContent = intervalId ? 'Ⅱ' : '▶';
}

function playSelectedSound() {
  if (customSoundUrl) {
    const audio = new Audio(customSoundUrl);
    audio.play().catch(() => playToneSequence(sounds[selectedSound]));
    return;
  }
  playToneSequence(sounds[selectedSound]);
}

function playToneSequence(frequencies) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + index * 0.18 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.18 + 0.32);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + index * 0.18);
    oscillator.stop(context.currentTime + index * 0.18 + 0.34);
  });
}

function finishTimer() {
  clearInterval(intervalId);
  intervalId = null;
  timerDeadline = null;
  completedSessions += 1;
  sessionCount.textContent = `${completedSessions} session${completedSessions === 1 ? '' : 's'} completed`;
  statusText.textContent = 'Session complete. Take a pause.';
  timerCaption.textContent = 'You did the work. Step away for a moment.';
  startButton.querySelector('span:last-child').textContent = 'Start another';
  if (shakeToggle.checked) {
    timerCard.classList.remove('shake');
    void timerCard.offsetWidth;
    timerCard.classList.add('shake');
  }
  playSelectedSound();
  if (focusToggle.checked && window.dpsDesktop) window.dpsDesktop.timerFinished();
  render();
}

function tick() {
  if (!timerDeadline) return;
  secondsRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
  if (secondsRemaining <= 0) {
    secondsRemaining = 0;
    finishTimer();
  }
  render();
}

function setTimer(minutes) {
  clearInterval(intervalId);
  intervalId = null;
  timerDeadline = null;
  selectedMinutes = minutes;
  totalSeconds = minutes * 60;
  secondsRemaining = totalSeconds;
  const isBreak = minutes < 25;
  modeLabel.textContent = isBreak ? 'RESET BREAK' : 'FOCUS SESSION';
  timerCaption.textContent = isBreak ? 'A small pause makes space for better work.' : 'One clear block. No distractions.';
  statusText.textContent = 'Ready when you are';
  document.querySelectorAll('.preset').forEach((preset) => preset.classList.toggle('active', Number(preset.dataset.minutes) === minutes));
  render();
}

startButton.addEventListener('click', () => {
  if (secondsRemaining === 0) setTimer(selectedMinutes);
  if (intervalId) {
    tick();
    clearInterval(intervalId);
    intervalId = null;
    timerDeadline = null;
    statusText.textContent = 'Timer paused';
  } else {
    timerDeadline = Date.now() + (secondsRemaining * 1000);
    tick();
    intervalId = setInterval(tick, 250);
    statusText.textContent = 'In the zone';
  }
  render();
});

resetButton.addEventListener('click', () => setTimer(selectedMinutes));
document.querySelectorAll('.preset').forEach((preset) => preset.addEventListener('click', () => setTimer(Number(preset.dataset.minutes))));
document.querySelectorAll('.sound-option').forEach((option) => option.addEventListener('click', () => {
  selectedSound = option.dataset.sound;
  customSoundUrl = null;
  soundName.textContent = `${option.textContent.trim()} sound`;
  document.querySelectorAll('.sound-option').forEach((item) => item.classList.toggle('selected', item === option));
}));
document.getElementById('soundButton').addEventListener('click', async () => {
  if (!window.dpsDesktop) return;
  const filePath = await window.dpsDesktop.chooseSound();
  if (filePath) {
    customSoundUrl = `file://${filePath.replaceAll('\\', '/')}`;
    soundName.textContent = filePath.split('\\').pop().split('/').pop();
    document.querySelectorAll('.sound-option').forEach((item) => item.classList.remove('selected'));
  }
});

render();
