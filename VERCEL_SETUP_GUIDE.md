# ⚡ AskSpace CI & Vercel Deployment Setup

Since your project is already connected directly to **Vercel** via GitHub integration:

1. **Continuous Integration (CI)**:
   - Managed automatically by GitHub Actions in [`.github/workflows/deploy.yml`](file:///c:/Users/Om/Documents/Placement%20Cell/ask_questions/.github/workflows/deploy.yml).
   - On every `git push` or `pull_request`, GitHub Actions runs TypeScript typechecks and `npm run build` to ensure no syntax errors are merged.
   - **No API tokens or secret keys required!**

2. **Continuous Deployment (CD)**:
   - Managed automatically by **Vercel**.
   - Whenever code is pushed to `main`/`master`, Vercel builds and deploys your changes to production instantly.
