# HYF Week 1 quiz — `just` recipes
# Install just: `brew install just` — see https://github.com/casey/just

set shell := ["bash", "-uc"]

# Default: list recipes
default:
    @just --list

# Full launch: Docker → Supabase → ngrok → Next.js. Idempotent — safe to re-run.
start:
    #!/usr/bin/env bash
    set -euo pipefail

    # 1. Docker Desktop
    if ! docker ps >/dev/null 2>&1; then
        echo "→ starting Docker Desktop (first boot can take ~30s)..."
        open -a Docker
        for i in {1..60}; do docker ps >/dev/null 2>&1 && break; sleep 1; done
        docker ps >/dev/null 2>&1 || { echo "✗ Docker did not start within 60s"; exit 1; }
    fi
    echo "✓ Docker"

    # 2. Supabase (Postgres + Auth + Realtime)
    if ! curl -sf http://127.0.0.1:54321/rest/v1/ -H "apikey: x" >/dev/null 2>&1; then
        echo "→ starting Supabase..."
        supabase start >/dev/null
    fi
    echo "✓ Supabase"

    # 3. ngrok tunnels (app + supabase)
    if ! curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
        echo "→ starting ngrok tunnels..."
        nohup ngrok start --all \
            --config "$HOME/Library/Application Support/ngrok/ngrok.yml" \
            --config "$HOME/Library/Application Support/ngrok/quiz-tunnels.yml" \
            > /tmp/ngrok.log 2>&1 &
        for i in {1..30}; do curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1 && break; sleep 1; done
    fi
    APP=$(curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import json,sys;print([t['public_url'] for t in json.load(sys.stdin)['tunnels'] if t['name']=='app'][0])")
    SUPA=$(curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import json,sys;print([t['public_url'] for t in json.load(sys.stdin)['tunnels'] if t['name']=='supabase'][0])")
    echo "✓ ngrok"

    # 4. Patch .env.local with the current Supabase tunnel URL + anon key
    ANON=$(supabase status -o env 2>/dev/null | grep '^ANON_KEY=' | cut -d= -f2- | tr -d '"')
    NEW_ENV=$(printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\n' "$SUPA" "$ANON")
    if [ -f .env.local ] && [ "$(cat .env.local)" = "$NEW_ENV" ]; then
        ENV_CHANGED=0
    else
        echo "$NEW_ENV" > .env.local
        ENV_CHANGED=1
    fi
    echo "✓ .env.local"

    # 5. Next.js (restart only if .env.local changed or it isn't running)
    if [ "$ENV_CHANGED" = "1" ] || ! curl -sf http://localhost:3000 >/dev/null 2>&1; then
        echo "→ (re)starting Next.js..."
        pkill -f "next dev" 2>/dev/null || true
        sleep 1
        nohup npm run dev > /tmp/kahoot-dev.log 2>&1 &
        for i in {1..30}; do curl -sf http://localhost:3000 >/dev/null 2>&1 && break; sleep 1; done
        curl -sf http://localhost:3000 >/dev/null 2>&1 || { echo "✗ Next.js did not start; tail /tmp/kahoot-dev.log"; exit 1; }
    fi
    echo "✓ Next.js"

    echo ""
    echo "──────────────────────────────────────────────────────"
    echo " Quiz live!"
    echo ""
    echo " HOST (open on your projector / browser):"
    echo "   $APP/host/dashboard"
    echo ""
    echo " Click \"Start Game\" → players join via the QR code."
    echo "──────────────────────────────────────────────────────"

# Open the host dashboard in your browser via the ngrok URL.
open:
    #!/usr/bin/env bash
    set -euo pipefail
    APP=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | python3 -c "import json,sys;print([t['public_url'] for t in json.load(sys.stdin)['tunnels'] if t['name']=='app'][0])" 2>/dev/null || true)
    if [ -z "${APP:-}" ]; then echo "ngrok not running — run \`just start\` first"; exit 1; fi
    open "$APP/host/dashboard"

# Show current ngrok public URLs.
urls:
    #!/usr/bin/env bash
    set -euo pipefail
    if ! curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
        echo "ngrok not running — run \`just start\`"; exit 1
    fi
    curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import json, sys; [print(f\"  {t['name']:10}  {t['public_url']}\") for t in json.load(sys.stdin)['tunnels']]"

# One-line health check of every service.
status:
    #!/usr/bin/env bash
    docker ps >/dev/null 2>&1                                              && echo "✓ Docker"   || echo "✗ Docker"
    curl -sf http://127.0.0.1:54321/rest/v1/ -H "apikey: x" >/dev/null 2>&1 && echo "✓ Supabase" || echo "✗ Supabase"
    curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1             && echo "✓ ngrok"    || echo "✗ ngrok"
    curl -sf http://localhost:3000 >/dev/null 2>&1                          && echo "✓ Next.js"  || echo "✗ Next.js"

# Wipe game/participant state between cohorts (keeps quiz questions).
reset:
    supabase db reset

# Stop Next.js + ngrok + Supabase. Docker Desktop stays up.
stop:
    #!/usr/bin/env bash
    pkill -f "next dev"   2>/dev/null && echo "✓ stopped Next.js" || echo "  Next.js not running"
    pkill -f "ngrok start" 2>/dev/null && echo "✓ stopped ngrok"   || echo "  ngrok not running"
    supabase stop 2>/dev/null && echo "✓ stopped Supabase"          || echo "  Supabase not running"
