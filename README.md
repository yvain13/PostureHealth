# Posture Health

An iPhone home-screen web app (PWA) hosted on GitHub Pages. Every 2 hours between **9 AM and 9 PM IST** it sends a posture reminder with the exercise names in the notification. Tap the notification to see how to do each one.

It follows a 2-week plan for desk workers: micro-breaks during work, evening yoga, postural strength sessions, and weekend runs.

## How it works

iOS can't schedule notifications from a web app on its own, so a free **GitHub Actions** cron job acts as the push server:

```
GitHub Actions (cron, every 2 h)  →  scripts/send.mjs  →  Web Push  →  iPhone notification
                                                                       ↓ tap
                                                          index.html?d=<date>&h=<hour>
```

- `plan.js` holds the 2-week plan, the exercise how-tos, and the reminder schedule. The app and the sender both use it.
- `index.html` shows what to do right now, today's reminder timeline, and the full plan.
- `sw.js` is the service worker: it receives pushes, opens the app when a notification is tapped, and caches the app for offline use.
- `scripts/send.mjs` works out the current IST slot and sends the push.
- `scripts/gen-keys.mjs` generates the VAPID keys (one-time).

## Reminder schedule (IST)

Every day, notifications cover only the desk micro-breaks. Yoga, strength and runs are done in the morning, so they aren't notified; the app still shows that day's session for reference.

| Time | Reminder |
|---|---|
| 9 AM | Morning set-up: Chin Tucks · Shoulder Drops |
| 11 AM, 3 PM, 5 PM, 7 PM | Posture reset: Chin Tucks · Shoulder Drops · 60-s Decompression |
| 1 PM | Lunch: Chest Opener · Chin Tucks · Shoulder Drops |
| 9 PM | Wind-down: Shoulder Drops · 60-s Decompression |

## Two-week plan

| Day | Week 1 | Week 2 |
|---|---|---|
| Mon | Workday Reset Yoga: Cat-Cow, Thread the Needle, Sphinx | Thread the Needle, Cobra, Child's Pose |
| Tue | Postural Strength ×3: Band Pull-Aparts 15, Glute Bridges 12, Plank 45 s | Pull-Aparts 20, Single-Leg Bridges 8/side, Plank 60 s |
| Wed | Mobility Yoga: Low Lunge, Puppy, Seated Twist | Low Lunge, Puppy, Standing Side-Bend |
| Thu | Core & Glutes ×3: Bird-Dog 10/side, Bridges 15, Pull-Aparts 20 | Bird-Dog with 3 s hold, Bridges 15, Pull-Aparts 20 |
| Fri | Weekend Prep Yoga: Child's Pose, Legs-Up-The-Wall, Bound Angle | Legs-Up-The-Wall, Sphinx, Seated Twist |
| Sat | Run 1, then 2×15 Bridges and 2×15 Pull-Aparts | Same |
| Sun | Run 2, then Low Lunge 5 min/side | Run 2, Low Lunge, Chest Stretch |

Week 1 starts on `START_DATE` in `plan.js` (Monday 26 Oct 2026), and the weeks alternate after that.

## Setup

1. **Generate keys** (already done; only needed again if you want new keys):
   ```sh
   node scripts/gen-keys.mjs
   ```
   This writes the public key to `config.js` and both keys to `vapid-private.txt`, which is git-ignored and must never be committed.

2. **Push to GitHub** and turn on Pages: **Settings → Pages → Deploy from a branch → `main` / root**. The repo must be public to use Pages on a free plan.

3. **Add the keys as repo secrets**: **Settings → Secrets and variables → Actions**:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`

   Copy both from `vapid-private.txt`.

4. **Install on iPhone** (iOS 16.4 or later): open `https://<username>.github.io/<repo>/` in Safari, tap **Share → Add to Home Screen**, then open the app from the home screen. Push only works from the home-screen app.

5. **Subscribe**: in the app, tap **Enable notifications** → Allow → **Copy**. Save what you copied as a third secret named `PUSH_SUBSCRIPTION`.
   For more than one device, use a JSON array: `[{...}, {...}]`.

6. **Test**: **Actions → Posture reminders → Run workflow**. Enter an hour (`9`, `11`, `13`, `15`, `17`, `19` or `21`) to send that slot's reminder now.

## Customising

- **Exercises / plan**: edit `EX` and `PLAN` in `plan.js`.
- **Reminder content per hour**: edit `reminderFor()` in `plan.js`.
- **Reminder times**: change `SLOTS` in `plan.js` **and** the cron line in `.github/workflows/reminders.yml`. Cron times are in UTC, and IST is UTC + 5:30.
- **Restart the 2-week cycle**: set `START_DATE` to a Monday.

Preview a reminder locally without sending it (dry run, since no subscription is set):

```sh
FORCE_SLOT=19 node scripts/send.mjs
```

## Things to know

- GitHub's scheduled jobs often start **5–20 minutes late**.
- GitHub turns off scheduled workflows after **60 days without a commit** to the repo. Make a small commit now and then, or re-enable it under Actions.
- If you reinstall the app or clear its data, the subscription changes. Repeat step 5. A failed run in the Actions log usually means the subscription has expired.

---

*For general wellness only, not medical advice. See a professional if pain persists.*
