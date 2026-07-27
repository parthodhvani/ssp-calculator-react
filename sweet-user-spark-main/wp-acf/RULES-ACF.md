# Rules page — WordPress / ACF guide

Same pattern as Calculate and Eligibility: editors change copy in WordPress; React only renders `content`.

## Connect React

Endpoint (replace `{ID}` with your Rules page ID):

```
https://devwp1.websiteserverhost.biz/ssp-calculator/wp-json/wp/v2/pages/{ID}
```

In `sweet-user-spark-main/.env`:

```
VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
VITE_WP_RULES_PAGE_ID=<your-rules-page-id>
# Optional if ID unset:
# VITE_WP_RULES_SLUG=rules
```

Restart `npm run dev` after changing `.env`.

## Setup (once)

1. Create a **Rules** page in WordPress (slug `rules`). Note the page ID.
2. **Custom Fields → Tools → Import** `rules-acf-field-group.json`.
3. Location: **Page = Rules** (re-select the page after import if needed).
4. Enable **Show in REST API**.
5. Fill the tabs → **Update**.
6. Set `VITE_WP_RULES_PAGE_ID` to that page ID.

## Tabs

| Tab | What you edit |
| --- | --- |
| **① Page header** | Kicker, title, description |
| **② Rule cards** | Repeater: icon, kicker, title, body, refs |
| **③ Bottom CTA** | Title, body, primary/secondary button text & links |

## Mapping

| ACF | React `content` |
| --- | --- |
| `header.kicker` / `title` / `description` | `kicker`, `title`, `description` |
| `sections[]` (`icon`, `kicker`, `title`, `body`, `refs[].text`) | `sections[]` (icon → Lucide component) |
| `cta.title` / `body` / `primary_*` / `secondary_*` | `ctaTitle`, `ctaBody`, CTA labels & links |

Icon select values: `scale` | `clock` | `alert` | `book`.
