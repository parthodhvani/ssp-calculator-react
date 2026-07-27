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

## Import

1. Create Page slug `calculate`
2. Import `acf-field-group.json`
3. Location = Calculate page · Show in REST API on
4. Set `VITE_WP_API_URL` on the React app

Endpoint:

```
GET /wp-json/wp/v2/pages?slug=calculate&_fields=id,slug,acf
```
