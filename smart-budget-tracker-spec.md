# Smart Budget Tracker — Project Spec

## What it is
A full-stack personal finance app where users track income and expenses, set category budgets, and get an AI-powered natural-language way to log transactions ("spent 40 bucks on lunch with friends" → auto-parsed into amount/category/date). It's built to prove three things to an employer: you can build a real full-stack app end to end, you can integrate a database and auth properly, and you can use an LLM API as a genuine feature, not a gimmick.

## Tech stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind
- **Backend:** Next.js API routes (full-stack in one repo)
- **Database + Auth:** Supabase (Postgres + built-in auth)
- **AI:** Anthropic or OpenAI API for natural-language transaction parsing
- **Charts:** Recharts or Chart.js
- **Deploy:** Vercel (app) + Supabase (data)

---

## Features, in build order

### Phase 1 — Foundation
1. **Project setup** — Next.js scaffolded, Supabase project created, deployed to Vercel on day one (even empty).
2. **Auth** — sign up, log in, log out, session-protected routes. Google OAuth optional but nice to have.
3. **Database schema** — `transactions` and `budgets` tables with Row Level Security so users only see their own data.

### Phase 2 — Core functionality
4. **Add/edit/delete transactions** — amount, category, description, date, type (income/expense).
5. **Transaction list view** — filterable by category, date range, and type; sortable; paginated if it gets long.
6. **Dashboard** — total balance, spending by category (pie/bar chart), monthly trend line (line chart).

### Phase 3 — Budgeting logic
7. **Budgets per category** — set a monthly limit (e.g. "Food: $300").
8. **Budget progress + alerts** — visual bar showing % used, warning state when close to or over the limit.
9. **Recurring transactions** — mark a transaction as recurring (rent, subscriptions, salary) so it auto-generates monthly instead of manual re-entry.

### Phase 4 — The AI differentiator (pick this one first, add others only if time allows)
10. **Natural-language transaction entry** — a text input where the user types a sentence, and an LLM call parses it into structured transaction fields, which the user can review/edit before saving.
   - *Optional stretch additions, only after this works well:* AI-generated monthly spending summary in plain English; receipt photo upload with AI extraction.

### Phase 5 — Real-world polish
11. **CSV import** — let users upload a bank export and map columns to your schema. Shows you can handle messy real-world data, not just clean form input.
12. **Empty/error/loading states** — every screen should handle "no data yet," "something failed," and "loading" gracefully. Small detail, big signal of care.
13. **Responsive design** — works on mobile widths, not just desktop.

### Phase 6 — Ship it
14. **Tests** — at minimum, unit tests on the core logic (budget calculations, category totals, the AI-parsing fallback logic). Wire up GitHub Actions to run them on every push.
15. **README** — problem statement in one line, screenshot or short demo gif, tech stack, setup instructions, what you'd improve next. This is what gets read before anyone opens your code.
16. **Final deploy + walkthrough** — make sure the live Vercel link works end to end with a fresh account, not just your own logged-in session.

---

## What NOT to add
Resist multi-currency support, a native mobile app, social/sharing features, or investment tracking. None of these make the portfolio stronger — they just delay a finished, working project. Ship the list above first; extend later only if you want to keep iterating after it's already live and on your GitHub.

## Why this project works for job applications
- Proves full-stack ability (auth, database, API, deployed UI)
- Shows real-world data handling (CSV import, recurring logic, RLS security)
- Includes a genuine AI integration, which is the single most in-demand differentiator right now
- Is scoped tightly enough to actually finish — a finished project always beats a bigger unfinished one
