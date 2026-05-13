# HYF Live Quiz

Live quiz tool used during [HackYourFuture](https://www.hackyourfuture.net/) Data Track classes. Forked from [supabase-community/kahoot-alternative](https://github.com/supabase-community/kahoot-alternative) and deployed at **[hyf-live-qa.pages.dev](https://hyf-live-qa.pages.dev)**.

## How it works

1. The host opens `/host` and starts a game
2. Students go to `/join` and enter the game code
3. The host advances questions; everyone's timer stays in sync
4. Results show the winner, per-player rankings, and a per-question answer grid

## URLs

| Route | Who | Purpose |
|---|---|---|
| `/join` | Students | Enter a game code to join |
| `/qa` | Students | Live Q&A board |
| `/host/dashboard` | Host | Create and manage games |
| `/host/game/[id]` | Host | Run a live game |

Both `/host/*` and student routes are password-protected (separate passwords).

## Deploy

Pushes to `main` auto-deploy to Cloudflare Pages via GitHub Actions.

To deploy manually:

```sh
npm run pages:deploy
```

Required secrets (set in GitHub repo settings and Cloudflare Pages):

| Secret | Where used |
|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions → wrangler deploy |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions → wrangler deploy |
| `NEXT_PUBLIC_SUPABASE_URL` | Build-time env var |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build-time env var |
| `HOST_PASSWORD` | Cloudflare Pages runtime |
| `CLIENT_PASSWORD` | Cloudflare Pages runtime |

## Run locally

```sh
npm install
supabase start
npm run dev
```

## Built with

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

[MIT](LICENSE)
