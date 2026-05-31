# CI/CD setup — push to `main` → auto build & deploy

The workflow `.github/workflows/deploy.yml` builds the Vite bundle and ships `dist/`
to your GCP VM over SSH (via IAP tunnel), then reloads nginx. It runs on every push
to `main` (and can be triggered manually from the Actions tab).

You only need to do this **once**.

## 1. Create a service account (GCP)

```bash
PROJECT=<your-project-id>
gcloud iam service-accounts create scaltrade-deployer \
  --display-name="ScalTrade GitHub deployer" --project "$PROJECT"

SA="scaltrade-deployer@${PROJECT}.iam.gserviceaccount.com"

# Allow it to reach/SSH the instance. (Tighten later with a custom role if you like.)
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" --role="roles/compute.instanceAdmin.v1"
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" --role="roles/iam.serviceAccountUser"
# Needed for --tunnel-through-iap SSH:
gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${SA}" --role="roles/iap.tunnelResourceAccessor"
```

Make sure the IAP TCP range can reach the VM on port 22:

```bash
gcloud compute firewall-rules create allow-iap-ssh \
  --direction=INGRESS --action=ALLOW --rules=tcp:22 \
  --source-ranges=35.235.240.0/20 --project "$PROJECT" || true
```

## 2. Create a key for the service account

```bash
gcloud iam service-accounts keys create sa-key.json \
  --iam-account="$SA" --project "$PROJECT"
cat sa-key.json   # copy the whole JSON
```

> ⚠️ Treat `sa-key.json` as a secret. Delete the local copy after pasting it into GitHub.

## 3. Add GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `GCP_SA_KEY` | the full contents of `sa-key.json` |
| `GCP_PROJECT` | your project id |
| `GCP_ZONE` | the VM's zone, e.g. `us-central1-a` |
| `GCP_INSTANCE` | the VM name |

Optional (Variables tab): `REMOTE_DIR` if your web root isn't `/var/www/scaltrade`.

## 4. Test it

- Push any commit to `main`, or open the **Actions** tab → *Build & Deploy* → **Run workflow**.
- Watch the run. On success it prints `✔ Deployed to <instance>:<dir>`.
- Reload `https://scaltrade.com` to confirm.

## Notes
- The workflow uses `--tunnel-through-iap`, so the VM does **not** need a public SSH port —
  only the IAP range `35.235.240.0/20` on tcp:22.
- nginx config is never modified by CI; it only copies files and runs `nginx -t` + reload.
- To roll back, re-run the workflow on an earlier commit (Actions → pick commit → re-run),
  or `git revert` and push.
