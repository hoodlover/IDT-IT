const stage = document.querySelector('#doviber-stage');
const lance = document.querySelector('#lance');
const lancePose = document.querySelector('#lance-pose');
const davisPose = document.querySelector('#davis-pose');
const davisGreeting = document.querySelector('#davis-greeting');
const davisFarewell = document.querySelector('#davis-farewell');
const lanceGreeting = document.querySelector('#lance-greeting');
const lanceFarewell = document.querySelector('#lance-farewell');
const toothGlint = document.querySelector('#tooth-glint');
const kazoow = document.querySelector('#kazoow');

const poses = {
  lance: {
    walk: '/doviber-lance-walk.webp',
    highfive: '/doviber-lance-highfive.webp',
    point: '/doviber-lance-point.webp',
  },
  davis: {
    walk: '/doviber-davis-walk-smile-v2.webp',
    highfive: '/doviber-davis-highfive.webp',
    point: '/doviber-davis-point.webp',
  },
};

const phases = {
  davis: { rank: 0, lance: 'walk', davis: 'walk' },
  lance: { rank: 1, lance: 'walk', davis: 'walk' },
  'lance-solo': { rank: 1, lance: 'walk', davis: 'walk' },
  ready: { rank: 2, lance: 'highfive', davis: 'highfive' },
  impact: { rank: 3, lance: 'highfive', davis: 'highfive' },
  cross: { rank: 4, lance: 'walk', davis: 'walk' },
  'point-lance': { rank: 5, lance: 'point', davis: 'point' },
  'point-davis': { rank: 6, lance: 'point', davis: 'point' },
  exit: { rank: 7, lance: 'point', davis: 'point' },
};

let clickCount = 0;
let running = false;
let timers = [];

function setPhase(phase) {
  const current = phases[phase];
  stage.className = `doviber-stage doviber-stage-${phase}`;
  stage.hidden = false;

  lance.hidden = current.rank < phases.lance.rank;
  lancePose.src = poses.lance[current.lance];
  davisPose.src = poses.davis[current.davis];

  davisGreeting.hidden = !['davis', 'lance'].includes(phase);
  lanceGreeting.hidden = !['lance', 'lance-solo'].includes(phase);
  lanceFarewell.hidden = phase !== 'point-lance';
  davisFarewell.hidden = phase !== 'point-davis';
  toothGlint.hidden = phase !== 'point-lance';
  kazoow.hidden = !['impact', 'cross'].includes(phase);
}

function resetStage() {
  stage.hidden = true;
  stage.className = 'doviber-stage';
  clickCount = 0;
  running = false;
  timers = [];
}

function startSurprise() {
  if (running) return;
  running = true;
  clickCount = 0;
  setPhase('davis');

  [
    ['lance', 1500],
    ['lance-solo', 2500],
    ['ready', 4000],
    ['impact', 4900],
    ['cross', 8900],
    ['point-lance', 11300],
    ['point-davis', 13700],
    ['exit', 16600],
  ].forEach(([phase, delay]) => {
    timers.push(window.setTimeout(() => setPhase(phase), delay));
  });

  timers.push(window.setTimeout(resetStage, 18400));
}

window.addEventListener('click', () => {
  if (running) return;
  clickCount += 1;
  if (clickCount === 3) startSurprise();
});

window.addEventListener('pagehide', () => {
  timers.forEach(window.clearTimeout);
});
