// Shared by the web app (browser) and the reminder sender (GitHub Actions / Node).

// The Monday that starts Week 1. Weeks then alternate 1, 2, 1, 2...
export const START_DATE = '2026-10-26';

// Reminder hours in IST (24h). The GitHub Actions cron fires at these times.
export const SLOTS = [9, 11, 13, 15, 17, 19, 21];

export const EX = {
  chinTuck:     { name: 'Chin Tucks', how: 'Sit tall. Pull your head straight back (soft double chin), hold 3 s, release.' },
  shoulderDrop: { name: 'Shoulder Drops', how: 'Lift shoulders toward ears, then let them drop completely away from your ears.' },
  decompress:   { name: '60-s Decompression', how: 'Stop typing, let your arms hang loose, take 5 deep belly breaths. Drop the shoulders on every exhale.' },
  chestOpener:  { name: 'Chest Opener', how: 'Interlace fingers behind your back (or hold a towel/strap) and gently straighten the arms to open the chest.' },
  catCow:       { name: 'Dynamic Cat-Cow', how: 'On all fours, move slowly through the spine. In Cat, push the floor away to spread the shoulder blades.' },
  threadNeedle: { name: 'Thread the Needle', how: 'From all fours, slide one arm under your body and rest the shoulder and temple down. Switch sides.' },
  sphinx:       { name: 'Sphinx Pose', how: 'Lie on your belly, forearms down, elbows under shoulders. Lift the chest gently, keep the neck long.' },
  cobra:        { name: 'Cobra Pose', how: 'Lie on your belly, hands under shoulders. Press up gently using your back, elbows soft, shoulders down.' },
  puppy:        { name: 'Puppy Pose', how: 'From all fours, walk hands forward and sink the chest toward the floor, hips above knees.' },
  childWide:    { name: "Child's Pose (wide knees)", how: 'Knees wide, big toes together, sit back toward heels and reach arms forward. Breathe into the lower back.' },
  boundAngle:   { name: 'Bound Angle Pose', how: 'Sit tall with soles of the feet together, knees falling open. Gently hinge forward.' },
  legsUpWall:   { name: 'Legs-Up-The-Wall', how: 'Lie on your back with legs resting up a wall, arms relaxed. Takes pressure off the lower back.' },
  lowLunge:     { name: 'Low Lunge', how: 'Back knee down, front knee over ankle. Tuck the pelvis and shift forward to stretch the hip flexor.' },
  seatedTwist:  { name: 'Seated Spinal Twist', how: 'Sit tall, cross one leg over, rotate toward the bent knee. Lengthen on inhale, twist on exhale.' },
  sideBend:     { name: 'Standing Side-Bend', how: 'Stand tall, reach one arm overhead and lean to the opposite side to open the ribs. Switch sides.' },
  chestStretch: { name: 'Standing Chest Stretch', how: 'Forearm on a door frame at shoulder height, step through gently until you feel the chest open.' },
  pullApart:    { name: 'Band Pull-Aparts', how: 'Hold a band at chest height, pull it apart by squeezing the shoulder blades together. Control the return.' },
  bridge:       { name: 'Glute Bridges', how: 'On your back, knees bent. Drive through the heels and lift the hips by squeezing the glutes, not by arching the back.' },
  slBridge:     { name: 'Single-Leg Glute Bridges', how: 'Same as a glute bridge with one leg extended. Keep the hips level.' },
  birdDog:      { name: 'Bird-Dog', how: 'On all fours, extend the opposite arm and leg slowly while keeping the back flat. Alternate sides.' },
  plank:        { name: 'Plank', how: 'Forearms under shoulders, body in one straight line, glutes and core braced.' },
  run:          { name: 'Run', how: 'Easy weekend run. Keep your hands loose and shoulders low.' },
};

const s = (title, mins, items, note) => ({ title, mins, items, note });
const i = (ex, dose) => ({ ex, dose });

// PLAN[week][day], day 0 = Monday ... 6 = Sunday
export const PLAN = [
  [
    s('Workday Reset Yoga', 15, [i('catCow', '5 rounds'), i('threadNeedle', '1 min/side'), i('sphinx', '1–2 min')]),
    s('Postural Strength', 20, [i('pullApart', '15'), i('bridge', '12'), i('plank', '45 s')], '3 rounds'),
    s('Mid-Week Mobility Yoga', 15, [i('lowLunge', '1 min/side'), i('puppy', '1 min'), i('seatedTwist', '1 min/side')]),
    s('Core & Glute Strength', 20, [i('birdDog', '10/side'), i('bridge', '15'), i('pullApart', '20')], '3 rounds'),
    s('Weekend Prep Yoga', 20, [i('childWide', '2 min'), i('legsUpWall', '5 min'), i('boundAngle', '2 min')]),
    s('Run 1 + Core Check', 45, [i('run', '30–45 min'), i('bridge', '2×15'), i('pullApart', '2×15')], 'Do the circuit right after the run'),
    s('Run 2 + Hip Flexor Release', 45, [i('run', '30–45 min'), i('lowLunge', '5 min/side')]),
  ],
  [
    s('Workday Reset Yoga', 15, [i('threadNeedle', '1 min/side'), i('cobra', '5 × 10 s'), i('childWide', '2 min')]),
    s('Postural Strength', 20, [i('pullApart', '20'), i('slBridge', '8/side'), i('plank', '60 s')], '3 rounds'),
    s('Mid-Week Mobility Yoga', 15, [i('lowLunge', '1 min/side'), i('puppy', '1 min'), i('sideBend', '30 s/side')]),
    s('Core & Glute Strength', 20, [i('birdDog', '10/side, 3 s hold'), i('bridge', '15'), i('pullApart', '20')], '3 rounds'),
    s('Weekend Prep Yoga', 20, [i('legsUpWall', '5 min'), i('sphinx', '2 min'), i('seatedTwist', '1 min/side')]),
    s('Run 1 + Core Check', 45, [i('run', '30–45 min'), i('bridge', '2×15'), i('pullApart', '2×15')], 'Do the circuit right after the run'),
    s('Run 2 + Hip Flexor Release', 45, [i('run', '30–45 min'), i('lowLunge', '5 min/side'), i('chestStretch', '1 min')]),
  ],
];

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// A Date whose UTC getters read as IST wall-clock time.
export function istNow(ms = Date.now()) {
  return new Date(ms + 5.5 * 3600e3);
}

export function dayInfo(ist) {
  const iso = ist.toISOString().slice(0, 10);
  const day = (ist.getUTCDay() + 6) % 7;
  const diffDays = Math.floor((Date.parse(iso) - Date.parse(START_DATE)) / 86400e3);
  const week = Math.max(0, Math.floor(diffDays / 7)) % 2;
  return { iso, day, week, session: PLAN[week][day] };
}

export const fmt = (items) => items.map((x) => `${EX[x.ex].name} (${x.dose})`).join(' · ');

const DESK = [i('chinTuck', '5 × 3 s'), i('shoulderDrop', '5')];

// What to do at a given IST hour. Returns null when there is no reminder.
export function reminderFor(info, hour) {
  const { session, day } = info;
  const weekend = day >= 5;
  let r = null;
  if (!weekend) {
    if (hour === 9) r = { title: 'Morning posture set-up', items: DESK, extra: `Tonight: ${session.title}` };
    else if (hour === 11 || hour === 15) r = { title: 'Posture reset', items: [...DESK, i('decompress', '5 breaths')] };
    else if (hour === 13) r = { title: 'Lunch chest opener', items: [i('chestOpener', '30 s × 2'), ...DESK] };
    else if (hour === 17) r = { title: 'Posture reset', items: DESK, extra: `Tonight: ${session.title}` };
    else if (hour === 19) r = { title: `${session.title} · ${session.mins} min`, items: session.items, extra: session.note };
    else if (hour === 21) r = { title: 'Wind-down', items: [i('childWide', '1 min'), i('decompress', '5 breaths')], extra: `Missed ${session.title}? Even 5 min counts.` };
  } else {
    if (hour === 9) r = { title: `${session.title}`, items: session.items, extra: session.note };
    else if (hour === 13) r = { title: 'Post-run check', items: session.items.filter((x) => x.ex !== 'run'), extra: 'Done after your run?' };
    else if (hour === 19) r = { title: 'Evening stretch', items: [i('chestOpener', '30 s × 2'), i('childWide', '2 min')] };
  }
  if (!r) return null;
  const body = [fmt(r.items), r.extra].filter(Boolean).join('\n');
  return { ...r, hour, body };
}

export function scheduleFor(info) {
  return SLOTS.map((h) => reminderFor(info, h)).filter(Boolean);
}
