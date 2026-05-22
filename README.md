# Inspire India Founder Circle Voting

A focused, fully functional voting platform for Inspire India Founder Circle events.

## What Is Included

- Mobile-first voting page at `/`
- One vote per attendee browser using a local voter key
- Duplicate vote blocking in the API
- Live polling leaderboard at `/leaderboard`
- Admin dashboard at `/admin`
- Add, edit, and delete teams
- Open or close voting
- Reset votes
- File-backed data store in `data/votes.json`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Deploy

This app can be deployed to Vercel as a standard Next.js app. The current simplified build uses `data/votes.json`, which is perfect for local demos but not for multi-instance production hosting.

For a real event on Vercel, replace `lib/data.ts` with Supabase or Firebase persistence so votes are shared reliably across serverless instances.

## Production Database Shape

```sql
events(id, name, tagline, date, status)
teams(id, event_id, team_name, startup_name, description, members, color)
votes(id, event_id, team_id, voter_key, created_at)
```

Add a unique constraint on `(event_id, voter_key)` to guarantee one vote per attendee.
