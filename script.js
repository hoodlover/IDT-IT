const stage = document.querySelector('#doviber-stage');
const lance = document.querySelector('#lance');
const lancePose = document.querySelector('#lance-pose');
const davisPose = document.querySelector('#davis-pose');
const davisGreeting = document.querySelector('#davis-greeting');
const davisFarewell = document.querySelector('#davis-farewell');
const lanceGreeting = document.querySelector('#lance-greeting');
const lanceFarewell = document.querySelector('#lance-farewell');
const lanceQuip = document.querySelector('#lance-quip');
const toothGlint = document.querySelector('#tooth-glint');
const kazoow = document.querySelector('#kazoow');
const railCurtain = document.querySelector('#rail-curtain');
const railLineA = document.querySelector('#rail-line-a');
const railLineB = document.querySelector('#rail-line-b');
const railLineC = document.querySelector('#rail-line-c');

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
    kick: '/doviber-davis-heel-kick.png',
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
  'kick-up': { rank: 7, lance: 'point', davis: 'kick' },
  'kick-hold': { rank: 8, lance: 'point', davis: 'kick' },
  'kick-land': { rank: 9, lance: 'point', davis: 'walk' },
  'lance-quip': { rank: 10, lance: 'point', davis: 'walk' },
  'chorus-1': { rank: 11, lance: 'walk', davis: 'walk' },
  'chorus-2': { rank: 12, lance: 'walk', davis: 'walk' },
  'chorus-3': { rank: 13, lance: 'walk', davis: 'walk' },
  finale: { rank: 14, lance: 'walk', davis: 'walk' },
  bow: { rank: 15, lance: 'walk', davis: 'walk' },
  'curtain-exit': { rank: 16, lance: 'walk', davis: 'walk' },
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
  lanceQuip.hidden = phase !== 'lance-quip';
  toothGlint.hidden = phase !== 'point-lance';
  kazoow.hidden = !['impact', 'cross'].includes(phase);

  const curtainVisible = current.rank >= phases['chorus-1'].rank;
  const curtainLinesVisible = current.rank < phases.finale.rank;
  railCurtain.hidden = !curtainVisible;
  railLineA.hidden = !curtainVisible || !curtainLinesVisible;
  railLineB.hidden = current.rank < phases['chorus-2'].rank || !curtainLinesVisible;
  railLineC.hidden = current.rank < phases['chorus-3'].rank || !curtainLinesVisible;
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
    ['kick-up', 16100],
    ['kick-hold', 16800],
    ['kick-land', 18800],
    ['lance-quip', 19600],
    ['chorus-1', 22100],
    ['chorus-2', 23600],
    ['chorus-3', 25100],
    ['finale', 27800],
    ['bow', 28800],
    ['curtain-exit', 32800],
  ].forEach(([phase, delay]) => {
    timers.push(window.setTimeout(() => setPhase(phase), delay));
  });

  timers.push(window.setTimeout(resetStage, 34800));
}

window.addEventListener('click', () => {
  if (running) return;
  clickCount += 1;
  if (clickCount === 3) startSurprise();
});

window.addEventListener('pagehide', () => {
  timers.forEach(window.clearTimeout);
});
