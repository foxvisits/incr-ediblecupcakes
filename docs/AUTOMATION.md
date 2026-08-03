# Automation: why it stops, and how to keep it running

## The 60-day disable

GitHub disables `schedule:` workflows after **60 days of repository
inactivity** and emails the repo owner a week or so beforehand. That email is
what you saw for *SEO checks and sitemap ping*.

The trap: **a push authenticated with the default `GITHUB_TOKEN` does not count
as repository activity.** GitHub deliberately excludes it, otherwise any
scheduled job that commits could keep itself alive forever. So the
`content: publish scheduled recipes [automated]` commits produced by
`content-publish.yml` never reset the 60-day clock, no matter how many of them
land.

Between 2026-06-10 and 2026-08-03 the repo had no human pushes at all, so the
clock ran out.

### Fixing it properly

Set a repository secret named **`CONTENT_BOT_TOKEN`** to a fine-grained
personal access token scoped to this repo with **Contents: read and write**.
`content-publish.yml` already prefers it over `GITHUB_TOKEN`:

```yaml
token: ${{ secrets.CONTENT_BOT_TOKEN || secrets.GITHUB_TOKEN }}
```

Pushes authenticated with a PAT are attributed to a user account and *do* count
as activity, so an actively publishing pipeline keeps its own schedules alive.

Note that fine-grained PATs expire (max one year). Put the expiry in your
calendar — a silently expired token turns the publish step into a failing push.

### If a workflow is already disabled

Actions → pick the workflow → **Enable workflow**. Any push, or a manual
**Run workflow** (both workflows now expose `workflow_dispatch`), also revives
it and resets the clock.

## Schedules

| Workflow | Cron | Why |
| --- | --- | --- |
| `content-publish.yml` | `0 6 * * *` | Publishes items in `content/scheduled/` whose date has arrived. Was hourly, which fired ~720×/month and almost always found nothing — the queue is only ever a handful of items deep. |
| `seo-and-ping.yml` | `17 3 * * *` | Regenerates SEO files, runs `seo-check` and `astro check`. Also runs on pushes that touch content or scripts, where it additionally pings IndexNow. |

## Secrets

| Secret | Used by | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `content-publish` | Recipe and guide text. |
| `KIE_API_KEY` | `content-publish` | Image generation. |
| `FAL_KEY` | `content-publish` | Optional image fallback. |
| `BING_API_KEY` | `seo-and-ping` | Bing Webmaster URL Submission. Skipped with a notice when absent. |
| `CONTENT_BOT_TOKEN` | `content-publish` | See above — keeps the schedules alive. |

`INDEXNOW_KEY` is **not** a secret. IndexNow verifies ownership by fetching
`/{key}.txt` from the site, so the key is public by design and lives in the
workflow file. `BING_API_KEY` is the opposite — anyone holding it can submit
URLs for the property, so it must stay a repository secret and out of git.

## Submitting URLs to search engines

`npm run update-seo -- --ping` does two things that still work:

- **IndexNow** — reaches Bing, Yandex, and Seznam.
- **Bing Webmaster URL Submission** — asks Bing to crawl specific URLs. A
  stronger signal than IndexNow, and it matters more than it looks: ChatGPT
  search runs on Bing's index, and AI surfaces are currently where this site
  gets most of its visibility.

**Neither reaches Google, and nothing does.** Google retired its sitemap ping
endpoint in January 2024 (it returns 404; Bing's returns 410 Gone) and offers no
public submission API. Both were still being called here until now, and their
failures were logged as warnings, which made `--ping` look busier than it was.
For Google the only levers are the sitemap referenced from `robots.txt`, the
Search Console sitemap submission, and manual "Request indexing".

## The publish queue

`content/scheduled/` is the queue. `npm run content:status` shows it.

**It is currently empty** — everything scheduled was published between
2026-06-06 and 2026-06-10. An empty queue means `content-publish.yml` runs and
does nothing, which is why the repository went quiet.

Refilling it is a content decision, not a maintenance one. See the indexing
note in the README before adding more: at the time of writing Google had
indexed 4 of the site's 96 URLs, so publishing more pages was not the
constraint.
