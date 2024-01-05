# Open source Kahoot alternative

This is an open source Kahoot alternative built with Supabase and Next.js.

1. The host starts the game
1. Players join the game
1. The host starts the questions
1. Players answer the questions
1. Results are shown

## Run locally

```sh
# Start Supabase
supabase start

# Start Next.js locally
npm run dev
```

## Generate Types

```sh
supabase gen types typescript --local --schema public > src/types/supabase.ts
```

Access the project root at `/` to join as a player.

Access `/host` to join as a host.
