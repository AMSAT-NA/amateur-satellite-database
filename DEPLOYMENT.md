# Deployment

This site is hosted on **Cloudflare Pages** in **Direct Upload** mode, deployed by **GitHub Actions** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)). It is served at [satdb.amsat.org](https://satdb.amsat.org).

---

## How it works

On every push to `main`:

1. GitHub Actions checks out the repo, installs dependencies with Node 24, and runs `npm run build` to produce `_dist/`.
2. The `_dist/` folder is uploaded as a build artifact, then downloaded again by the `deploy` job (this keeps build and deploy as separate jobs/environments).
3. The `deploy` job runs `cloudflare/wrangler-action@v3` with `command: pages deploy _dist --project-name=amateur-satellite-database`, which pushes the already-built files straight to Cloudflare Pages.

Pull requests run the `build` job only (so build failures show up in PR checks), not `deploy`.

### Why Direct Upload, not Cloudflare's Git integration

Cloudflare Pages normally offers to connect directly to a GitHub repo and run its own build ("Connect to Git" in the dashboard). **This project intentionally does not use that.** The build already happens in GitHub Actions, pinned to a specific Node version (24) and using this repo's exact `package-lock.json` — including the `patch-package` fix for a [known @datagraphics/baker bug](https://github.com/datadesk/baker/issues/1624). Letting Cloudflare _also_ run a build would be redundant at best, and at worst could drift out of sync with the GitHub Actions build (different Node version, skipped patches, different env vars) and silently ship something different from what CI verified.

If you open the Cloudflare dashboard for this project and see an option to connect a Git repository, **leave it disconnected** — that's expected, not a misconfiguration.

---

## One-time setup: creating the Pages project

The Cloudflare Pages project itself is a prerequisite for the workflow above — it has to exist before `wrangler pages deploy` has anywhere to push to. This is a **one-time step**, already done for this repo. You'd only need to repeat it if the project is ever deleted from Cloudflare or you're setting this up from scratch (e.g. a new environment, a renamed project).

```bash
npx wrangler login   # if not already authenticated
npx wrangler pages project create amateur-satellite-database --production-branch main
```

Verify it exists:

```bash
npx wrangler pages project list
```

The `--project-name` in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (`pages deploy _dist --project-name=amateur-satellite-database`) must match the project name created here **exactly** — case-sensitive, no typos. A mismatch here fails silently in the sense that `wrangler` will just create/deploy to a _different_ project than the one with the custom domain attached, rather than throwing an obvious error.

Do not `wrangler pages deploy` manually from a workstation for routine deploys — that bypasses the CI build and defeats the point of Direct Upload from a known build. Manual deploys are only for exceptional troubleshooting.

---

## Required GitHub secrets/variables

| Name                    | Type                            | Where it lives                                                        | Purpose                                                                             |
| ----------------------- | ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Secret, org-wide                | GitHub org settings → Secrets and variables → Actions                 | Auth token `wrangler-action` uses to deploy                                         |
| `CLOUDFLARE_ACCOUNT_ID` | Variable (not secret), org-wide | GitHub org settings → Secrets and variables → Actions → Variables tab | Identifies the Cloudflare account (not sensitive, so it's a variable, not a secret) |

Both are org-wide, so `${{ vars.CLOUDFLARE_ACCOUNT_ID }}` and `${{ secrets.CLOUDFLARE_API_TOKEN }}` in the workflow resolve from org settings — there's nothing to configure at the repo level for either.

If either ever needs to be rotated or recreated:

- **Account ID**: Cloudflare dashboard → any Cloudflare Pages/Workers page → the account ID is shown in the right sidebar, or run `npx wrangler whoami`.
- **API Token**: Cloudflare dashboard → My Profile → API Tokens → Create Token. Use the "Edit Cloudflare Workers" template or a custom token with at minimum `Account.Cloudflare Pages: Edit` permission for the AMSAT-NA account.

Since both are **org-wide**, coordinate before rotating either — other repos may depend on the same values.

---

## Custom domain (satdb.amsat.org)

The custom domain is attached via the Cloudflare dashboard, not via `wrangler` (there's no CLI subcommand for it as of wrangler 4.x — it can also be done via the Cloudflare API's `POST /accounts/{account_id}/pages/projects/{project}/domains`, which is how it was done for this repo, using a `wrangler login` OAuth session):

1. Cloudflare dashboard → Workers & Pages → **amateur-satellite-database** project → **Custom domains** tab.
2. Add `satdb.amsat.org`.
3. **This does not auto-create the DNS record**, even though `amsat.org`'s DNS is already on Cloudflare. The domain sits in `pending` status (`CNAME record not set`) until a CNAME is added manually:
   - `satdb` → `amateur-satellite-database.pages.dev`, proxied (orange cloud on).
   - Cloudflare dashboard → DNS → Records → Add record, in the `amsat.org` zone.

This only needs to be done once per project. If the project is ever deleted and recreated, this step needs to be redone. Registering the domain with the Pages project (step 1–2 above) and creating the CNAME (step 3) are two separate actions — both are required before the domain resolves.

---

## Troubleshooting

**Check deploy status/logs:**

- GitHub side (build + deploy steps, most common place to look first): repo → **Actions** tab → latest run of "Build and Deploy".
- Cloudflare side (what was actually received/published):
  ```bash
  npx wrangler pages deployment list --project-name=amateur-satellite-database
  ```

**Common failure points:**

- `--project-name` in the workflow doesn't match the actual Cloudflare Pages project name → deploy step succeeds but pushes to/creates the wrong project. Compare against `npx wrangler pages project list`.
- `CLOUDFLARE_API_TOKEN` expired or lacks Pages permissions → deploy step fails with an auth error in the Actions log.
- Build succeeds in Actions but the site doesn't update → check that the `deploy` job actually ran (it's gated on `github.ref == 'refs/heads/main'`; it does not run on pull requests).
