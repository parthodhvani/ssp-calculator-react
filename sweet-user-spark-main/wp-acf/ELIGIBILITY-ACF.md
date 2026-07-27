# Eligibility page — WordPress / ACF guide

Same pattern as the Calculate page: editors change copy in WordPress; React only renders `content`.

## Connect React

Endpoint:

```
https://devwp1.websiteserverhost.biz/ssp-calculator/wp-json/wp/v2/pages/149
```

In `sweet-user-spark-main/.env`:

```
VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
VITE_WP_ELIGIBILITY_PAGE_ID=149
```

Restart `npm run dev` after changing `.env`.

## Setup (once)

1. Create / open the **Eligibility** page (ID **149**, slug `eligibility`).
2. **Custom Fields → Tools → Import** `eligibility-acf-field-group.json`.
3. Location: **Page = Eligibility** (re-select if needed).
4. Enable **Show in REST API**.
5. Fill the tabs → **Update**.

## Tabs

| Tab | What you edit |
| --- | --- |
| **① Page header** | Kicker, title, description |
| **② Questions** | Quiz questions (add / edit / reorder) |
| **③ Yes / No buttons** | Button labels |
| **④ Result & buttons** | Outcome messages + CTA text **and links** |

## Mapping

| ACF | React `content` |
| --- | --- |
| `header.kicker` / `title` / `description` | `kicker`, `title`, `description` |
| `questions[]` (`id`, `question`, `hint`) | `questions[]` (`id`, `q`, `hint`) |
| `answers.yes_label` / `no_label` | `yesLabel`, `noLabel` |
| `outcomes.*` | `outcomes.*` (titles, bodies, CTA labels & links) |

UI layout stays the same — only the words/links become editable.
