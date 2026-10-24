// Run by GitHub Actions on a schedule: works out the current IST slot and pushes it.
// With --check it only reports which slot is due (as a cache key in $GITHUB_OUTPUT), so the
// workflow can skip slots that were already sent.
import { appendFileSync } from 'node:fs';
import { SLOTS, istNow, dayInfo, reminderFor } from '../plan.js';

const ist = istNow();
const info = dayInfo(ist);
const forced = process.env.FORCE_SLOT ? Number(process.env.FORCE_SLOT) : null;
// The cron runs every 15 min and can start late, so use the latest slot that has begun,
// as long as we are still within 2 hours of it.
const nowHour = ist.getUTCHours();
const latest = SLOTS.filter((h) => h <= nowHour).pop();
const hour = forced ?? (latest != null && nowHour < latest + 2 ? latest : null);

const r = hour != null && reminderFor(info, hour);
if (!r) {
  console.log(`No reminder due for ${info.iso} at ${nowHour}:xx IST`);
  process.exit(0);
}

if (process.argv.includes('--check')) {
  const key = `sent-${info.iso}-${hour}`;
  console.log(`Due: ${key}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `key=${key}\n`);
  process.exit(0);
}

const payload = JSON.stringify({
  title: r.title,
  body: r.body,
  tag: `posture-${info.iso}-${hour}`,
  url: `./?d=${info.iso}&h=${hour}`,
});
console.log(payload);

const raw = process.env.PUSH_SUBSCRIPTION;
if (!raw) {
  console.log('PUSH_SUBSCRIPTION not set: dry run, nothing sent.');
  process.exit(0);
}

const { default: webpush } = await import('web-push');
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'https://github.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const subs = [].concat(JSON.parse(raw));
let failed = 0;
for (const sub of subs) {
  try {
    const res = await webpush.sendNotification(sub, payload, { TTL: 3600, urgency: 'high' });
    console.log('Sent', res.statusCode);
  } catch (err) {
    failed++;
    console.error('Push failed', err.statusCode, err.body);
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.error('Subscription expired: open the app, tap "Enable notifications" again and update the PUSH_SUBSCRIPTION secret.');
    }
  }
}
process.exit(failed === subs.length ? 1 : 0);
