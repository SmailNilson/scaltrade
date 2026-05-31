# CI/CD setup — push to `main` → auto build & deploy

The workflow `.github/workflows/deploy.yml` builds the Vite bundle and ships `dist/`
to the GCP VM over SSH (via IAP tunnel), then reloads nginx. It runs on every push
to `main` (and can be triggered manually from the Actions tab).

Auth is **keyless** via **Workload Identity Federation (WIF)** — this org enforces
`constraints/iam.disableServiceAccountKeyCreation`, so downloadable SA keys are not
an option (and WIF is the more secure choice anyway). GitHub's OIDC token is
exchanged for short-lived GCP credentials; nothing secret is stored in the repo.

You only need to do this **once**. It is already configured for this project; the
steps below document what was set up.

## 1. Deployer service account (GCP)

```bash
PROJECT=riskdesk2-prod-v2
SA="scaltrade-deployer@${PROJECT}.iam.gserviceaccount.com"

gcloud iam service-accounts create scaltrade-deployer \
  --display-name="ScalTrade CI/CD deployer" --project "$PROJECT"

# Reach + SSH (key pushed to instance metadata) + IAP tunnel.
for ROLE in roles/compute.instanceAdmin.v1 roles/iap.tunnelResourceAccessor roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT" \
    --member="serviceAccount:${SA}" --role="$ROLE" --condition=None
done
```

The IAP TCP range (`35.235.240.0/20`) must already reach the VM on tcp:22 — it does
here via the existing `allow-ssh-iap` firewall rule.

## 2. Workload Identity Federation (keyless)

A pool + GitHub OIDC provider already exist and are reused:

```bash
PROJECT=riskdesk2-prod-v2
PROJECT_NUMBER=996205287726
REPO=SmailNilson/scaltrade

# Pool + provider (issuer https://token.actions.githubusercontent.com,
# attributeCondition: assertion.repository_owner == 'SmailNilson').
#   pool:     github-pool
#   provider: github-provider

# Let ONLY this repo impersonate the deployer SA:
gcloud iam service-accounts add-iam-policy-binding "scaltrade-deployer@${PROJECT}.iam.gserviceaccount.com" \
  --project="$PROJECT" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${REPO}"
```

Full provider resource name (used as the `GCP_WIF_PROVIDER` secret):

```
projects/996205287726/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

## 3. GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `GCP_WIF_PROVIDER` | the full provider resource name above |
| `GCP_SA_EMAIL` | `scaltrade-deployer@riskdesk2-prod-v2.iam.gserviceaccount.com` |
| `GCP_PROJECT` | `riskdesk2-prod-v2` |
| `GCP_ZONE` | `us-central1-a` |
| `GCP_INSTANCE` | `riskdesk-prod-v2` |

Optional (Variables tab): `REMOTE_DIR` if the web root isn't `/var/www/scaltrade`.

The workflow job declares `permissions: id-token: write` — **required** for WIF.

## 4. Test it

- Push any commit to `main`, or **Actions** tab → *Build & Deploy* → **Run workflow**.
- On success it prints `✔ Deployed to <instance>:<dir>`.
- Reload `https://scaltrade.com` to confirm.

## Notes
- `--tunnel-through-iap` means the VM needs **no** public SSH port — only the IAP
  range `35.235.240.0/20` on tcp:22 (already allowed).
- nginx config is never modified by CI; it only copies files and runs `nginx -t` + reload.
- To roll back: re-run the workflow on an earlier commit (Actions → pick commit → re-run),
  or `git revert` and push.
