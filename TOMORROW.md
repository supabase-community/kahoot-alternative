# HYF Week 1 quiz — runbook

26 multiple-choice questions covering Week 1 chapters 1-9. Runs on your laptop, students join from their phones over the classroom wifi.

**Verified end-to-end via Playwright** (host dashboard → Start Game → host lobby with QR → player join with nickname → student name appears in host lobby in realtime → host advances to first question → projector shows Kahoot-style 4-colour answer cards with countdown). Two patches applied to make this work locally:
- `supabase/config.toml`: enabled `enable_anonymous_sign_ins = true` (host + each player needs an anon uid for the RLS policies on `games` and `participants`)
- `src/app/host/game/[id]/lobby.tsx`: replaced the hardcoded `https://kahoot-alternative.vercel.app/game/<id>` QR target with `window.location.origin` so phones scan a URL pointing at YOUR laptop, not at a Vercel deployment that doesn't exist

## Before class (5 min)

```bash
# 1. Make sure Docker Desktop is running
open -a Docker

# 2. From this directory:
supabase start          # Postgres + Realtime + Auth (~30s)
npm run dev             # Next.js on http://localhost:3000
```

## Find your laptop's wifi IP

```bash
ipconfig getifaddr en0
# example output: 192.168.178.95
```

If `en0` is empty, try `en1`. This is the IP students will hit from their phones.

## Run the quiz

1. **You** open `http://localhost:3000` (redirects to `/host/dashboard`).
2. Find **HYF Data Track — Week 1: Python Foundations** (26 questions). Click **Start Game**.
3. A new tab opens with the host lobby + a **QR code**. The QR encodes the player URL `http://<your-laptop-ip>:3000/game/<game-id>`.
4. **Project the lobby tab** so students can scan the QR or read the URL underneath it.
5. Players scan, enter a nickname, land in the lobby. Their names appear on your screen as they join.
6. When everyone's in, click **Start Game** in the lobby. Questions appear one at a time on your projector + on every phone simultaneously.

## Reset between cohorts

```bash
supabase db reset       # nukes the DB, re-applies migrations + seed
```

## Stop everything

```bash
# Ctrl+C the `npm run dev` window
supabase stop
```

## If something breaks during class

| Symptom | Fix |
|---|---|
| Phones can't reach the URL | Confirm everyone's on the same wifi. Check the IP — laptop IP changes between networks. |
| QR code points at vercel.app | The `lobby.tsx` patch didn't apply. The QR `text=` prop should use `window.location.origin`, not the vercel URL. |
| `npm run dev` crashes | Check `/tmp/kahoot-dev.log`. Usually a missing `.env.local` (needs `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`). |
| `supabase start` hangs | Docker Desktop probably isn't running yet. Open it, wait for the whale to settle, retry. |
| Students see "Failed to fetch" | Realtime connection issue. The Supabase realtime container might be unhealthy. Run `supabase status` and look for a red service. `supabase stop && supabase start` usually fixes it. |
| You want to demo without students | Open one tab as host, open the QR URL in a second tab on your laptop, join with a nickname — works as a single-machine smoke test. |
| `Failed to start game` after a `db reset` between cohorts | Stale anon JWT in your browser localStorage points at a user that no longer exists. Already handled — the dashboard catches the FK error (`23503`), signs out, signs back in fresh, and retries the insert. If it ever loops forever, manually clear localStorage for the app origin in DevTools → Application → Storage. |
| Browser shows ngrok "Visit Site" interstitial on AJAX calls (raw HTML in JSON parser → "Failed to fetch") | Already handled — `src/types/types.ts` sends the `ngrok-skip-browser-warning` header on every Supabase request. The page-level interstitial only appears once per top-level navigation; students click through it once when they first scan the QR. |

## How to add / edit questions

Edit `supabase/seed.sql`, then:

```bash
supabase db reset       # re-applies the seed
```

The `add_question()` SQL function takes:
- `quiz_set_id` — the UUID at the top of the seed (`aaaaaaaa-bbbb-cccc-dddd-000000000001` for Week 1)
- `body` — the question text
- `order` — 0-indexed position
- `choices` — JSON array; each `{"body": "...", "is_correct": true|false}`. Multiple correct is allowed but Week 1 uses single-correct throughout.

## Want students to join from outside the wifi?

The app needs **two** public URLs (Next.js port 3000 + Supabase port 54321) because the browser-side JS calls Supabase directly.

⚠️ **Security note**: tunnelling Supabase exposes your local Auth + REST + Realtime + the anon key for the duration. RLS limits damage but the surface is public until you Ctrl+C the tunnel. Don't leave it running unattended.

### ngrok (verified, recommended if you have it authed)

A second config file at `~/Library/Application Support/ngrok/quiz-tunnels.yml` already defines both tunnels. Start them with:

```bash
ngrok start --all \
  --config "$HOME/Library/Application Support/ngrok/ngrok.yml" \
  --config "$HOME/Library/Application Support/ngrok/quiz-tunnels.yml"
```

Then read the two URLs from the local API (port 4040):

```bash
curl -s http://127.0.0.1:4040/api/tunnels | python3 -c '
import json, sys
for t in json.load(sys.stdin)["tunnels"]:
    print(f"{t[\"name\"]:10}  {t[\"public_url\"]}")
'
```

Output:
```
app         https://<random>.ngrok-free.app   ← share this with students (QR codes auto-use it)
supabase    https://<other>.ngrok-free.app    ← put this in .env.local
```

Now patch `.env.local` and restart Next.js:

```bash
# Replace the URL with the "supabase" value from above
sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=https://<supabase-tunnel>.ngrok-free.app|" .env.local
pkill -f "next dev"; npm run dev
```

The lobby's QR code uses `window.location.origin`, so it auto-encodes the public app URL — no further changes needed.

**Heads up**: ngrok-free shows a "Visit Site" interstitial on first navigation per browser. Students click through once, then the app loads. To skip it, attach `ngrok-skip-browser-warning: 1` via a paid plan or via custom domain.

### cloudflared alternative

Same shape, no signup, supports unlimited free tunnels:

```bash
cloudflared tunnel --url http://localhost:3000     # in one terminal
cloudflared tunnel --url http://localhost:54321    # in another
```

Read the two `https://*.trycloudflare.com` URLs from each terminal's output and apply the same `.env.local` + restart.
