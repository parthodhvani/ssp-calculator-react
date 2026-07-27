# Calculate page — editor guide (step by step)

Tabs match the website layout. Edit → **Update** → refresh the site.

## Tabs

| Tab | Matches on the website |
| --- | --- |
| **① Hero (left side)** | Badges, title, description, **buttons + links** |
| **② Sample Card (right side)** | Example entitlement card (Year 1/2 % come from Pay Rules) |
| **③ Statistics** | 104 / 70% / min-wage row |
| **④ Calculator Form** | Every form field **line by line**, including **industries** + submit button |
| **⑤ Pay Rules ⚡** | Year 1/2 %, weeks, waiting days — **drives the maths** |
| **⑥ Your Entitlement** | Live blue card labels + **policy button + link** |
| **⑦ How It Works** | Bottom steps |

## Live blue card

When a visitor types **Gross monthly salary**, the blue **Your entitlement** card updates immediately using Pay Rules percentages.

## Buttons live in their sections

- Hero → Primary button text **and** link (`#calculator`)
- Hero → Secondary link text **and** URL (`/eligibility`)
- Form → Submit button text **and** optional link
- Your Entitlement → Policy button title, description, **and** link (`/policy-analyser`)

## Connect React to this WordPress page

Your live endpoint:

```
https://devwp1.websiteserverhost.biz/ssp-calculator/wp-json/wp/v2/pages/130
```

Create `sweet-user-spark-main/.env`:

```
VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
VITE_WP_CALCULATE_PAGE_ID=130
```

Then restart the dev server (`npm run dev`).

## Import field group (once)

1. Import `acf-field-group.json`
2. Attach to Page ID **130** (Calculator page)
3. Enable **Show in REST API**
