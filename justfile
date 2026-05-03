# HYF Week 1 quiz — `just` recipes
# Install just: `brew install just` — see https://github.com/casey/just

set shell := ["bash", "-uc"]

# Where the curriculum repo lives. Quiz SQL files matching
# `Data Track/Week */assets/week_*__live_quiz.sql` are auto-loaded by
# `just load-quizzes` and re-loaded by `just watch-quizzes` on save.
curriculum_repo := "/Users/lasse/Documents/github/hyf/datatrack"

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

    # 6. Auto-load curriculum quiz SQL files (idempotent — each file is a
    #    DELETE-then-INSERT for its own quiz_set IDs).
    just load-quizzes

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

# Print the SHAREABLE URLs (with the right path per service) for the
# currently running tunnel set — ngrok if up, else cloudflared.
urls:
    #!/usr/bin/env bash
    set -uo pipefail
    if curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
        APP=$(curl -s http://127.0.0.1:4040/api/tunnels  | python3 -c "import json,sys;print(next((t['public_url'] for t in json.load(sys.stdin)['tunnels'] if t['name']=='app'), ''))")
        QA=$(curl -s http://127.0.0.1:4040/api/tunnels   | python3 -c "import json,sys;print(next((t['public_url'] for t in json.load(sys.stdin)['tunnels'] if t['name']=='qa'),  ''))")
    elif pgrep -f "cloudflared tunnel" >/dev/null; then
        APP=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cf-app.log     2>/dev/null | head -1)
        QA=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com'  /tmp/cf-qa.log      2>/dev/null | head -1)
    else
        echo "no tunnels running — \`just start\` (ngrok) or run cloudflared manually"
        exit 1
    fi
    echo "Quiz host:        $APP/host/dashboard"
    echo "Quiz player:      (from QR code in the host's lobby)"
    [ -n "$QA" ] && echo "Q&A teacher:      $QA/host/qa"
    [ -n "$QA" ] && echo "Q&A student:      $QA/qa"

# One-line health check of every service.
status:
    #!/usr/bin/env bash
    docker ps >/dev/null 2>&1                                              && echo "✓ Docker"      || echo "✗ Docker"
    curl -sf http://127.0.0.1:54321/rest/v1/ -H "apikey: x" >/dev/null 2>&1 && echo "✓ Supabase"    || echo "✗ Supabase"
    curl -sf http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1             && echo "✓ ngrok"       || echo "  ngrok not running"
    pgrep -f "cloudflared tunnel" >/dev/null                                && echo "✓ cloudflared" || echo "  cloudflared not running"
    curl -sf http://localhost:3000 >/dev/null 2>&1                          && echo "✓ Next.js (3000)" || echo "✗ Next.js (3000)"
    curl -sf http://localhost:3001 >/dev/null 2>&1                          && echo "✓ Next.js (3001 — Q&A)" || echo "  Next.js (3001) not running"

# Wipe game/participant state between cohorts (keeps quiz questions).
reset:
    supabase db reset

# Auto-load every `Data Track/Week */assets/week_*__live_quiz.sql` from the curriculum repo into the running Supabase. Idempotent — replaces in place.
load-quizzes:
    #!/usr/bin/env bash
    set -uo pipefail
    if ! curl -sf http://127.0.0.1:54321/rest/v1/ -H "apikey: x" >/dev/null 2>&1; then
        echo "✗ Supabase not running — run \`just start\` first"; exit 1
    fi
    shopt -s nullglob
    files=("{{ curriculum_repo }}/Data Track"/Week*/assets/week_*__live_quiz.sql)
    if [ ${#files[@]} -eq 0 ]; then
        echo "  (no curriculum quiz files found under {{ curriculum_repo }}/Data Track/Week */assets/)"
        exit 0
    fi
    for f in "${files[@]}"; do
        if PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 -q -f "$f" >/dev/null 2>&1; then
            echo "✓ loaded $(basename "$f")"
        else
            echo "✗ failed  $(basename "$f") — re-run with \`PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f \"$f\"\` to see the error"
        fi
    done

# Watch curriculum quiz files; reload on save (uses fswatch if installed, else 1s polling). Ctrl+C to stop.
watch-quizzes:
    #!/usr/bin/env bash
    set -uo pipefail
    glob="{{ curriculum_repo }}/Data Track/Week */assets/week_*__live_quiz.sql"
    echo "watching: $glob"
    echo "Ctrl+C to stop."
    if command -v fswatch >/dev/null 2>&1; then
        # fswatch event-driven (instant)
        fswatch -o {{ curriculum_repo }}/"Data Track" \
            --include 'week_.*__live_quiz\.sql$' --exclude '.*' \
            | while read -r _; do
                echo "→ change detected"
                just load-quizzes
            done
    else
        # Polling fallback. Compute a fingerprint of all matching files'
        # mtime + size and re-scan on change.
        prev=""
        while true; do
            cur=$(stat -f '%m %z %N' {{ curriculum_repo }}/"Data Track"/Week*/assets/week_*__live_quiz.sql 2>/dev/null | sort | shasum)
            if [ "$cur" != "$prev" ] && [ -n "$prev" ]; then
                echo "→ change detected"
                just load-quizzes
            fi
            prev="$cur"
            sleep 1
        done
    fi

# Stop Next.js + ngrok + cloudflared + Supabase. Run when session ends — keeps the Supabase tunnel from staying exposed.
stop:
    #!/usr/bin/env bash
    pkill -f "next dev"            2>/dev/null && echo "✓ stopped Next.js"     || echo "  Next.js not running"
    pkill -f "ngrok start"         2>/dev/null && echo "✓ stopped ngrok"       || echo "  ngrok not running"
    pkill -f "cloudflared tunnel"  2>/dev/null && echo "✓ stopped cloudflared" || echo "  cloudflared not running"
    supabase stop                  2>/dev/null && echo "✓ stopped Supabase"    || echo "  Supabase not running"
