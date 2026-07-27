# Calculate page — WordPress / ACF guide (for editors)

This page’s content is edited in WordPress. **You do not need a developer** to change copy, percentages, labels, or defaults.

## Quick start

1. In WP Admin open **Pages → Calculate** (slug must be `calculate`).
2. You’ll see a box titled **Calculate Page Content** with **9 tabs**.
3. Edit what you need → click **Update**.
4. Refresh the website.

Frontend reads:

```
GET /wp-json/wp/v2/pages?slug=calculate&_fields=id,slug,acf
```

Set on the React app:

```
VITE_WP_API_URL=https://your-wp-site.com
```

---

## The 9 tabs (what each one does)

| Tab | What you change | Appears on site as |
| --- | --- | --- |
| **1. Hero Banner** | Badge, title, description, buttons | Top of Calculate page |
| **2. Key Statistics** | Number + label rows | Stats under the hero |
| **3. Preview Card** | Example amount / progress | Card beside the hero |
| **4. Industries** | Dropdown options | Industry select in the form |
| **5. Calculator Form** | All form labels + **Salary** + **Hours** settings | The calculator form |
| **6. Pay Rules ⚡** | Year 1 / Year 2 %, weeks, waiting days, min wage | **The actual maths** + result % text |
| **7. Result Display** | Result card labels (`{percent}` auto-fills) | Dark result card |
| **8. How It Works** | Heading + step cards | Bottom section |
| **9. CTA & Disclaimer** | Policy CTA + legal line | Under result / under form |

---

## Most important: Pay Rules ⚡

These fields **drive the calculation**:

| Field in WP | Example | Effect |
| --- | --- | --- |
| Year 1 sick pay | `75` | Year 1 pay = salary × 75% |
| Year 2 sick pay | `50` | Year 2 pay = salary × 50% |
| Maximum entitlement | `104` | Week limit |
| Waiting days | `1` | Unpaid start days |
| Linked-absence window | `28` | Days that link two absences |
| Minimum wage (monthly) | `2437` | Statutory floor reference |

In **Result Display**, titles like:

```
Year 1 · {percent}% of gross (statutory)
```

automatically become:

```
Year 1 · 75% of gross (statutory)
```

when Year 1 sick pay is `75`. **Do not type the percentage into the title** — use `{percent}`.

---

## Salary & Hours (Form tab)

Inside **5. Calculator Form** you’ll find two clear groups:

### Salary field
- Field label  
- Placeholder  
- Default value  
- Min / Max / Step  

### Hours field
- Field label  
- Placeholder  
- Default value  
- Min / Max / Step  

Changing these updates the website inputs. No code deploy.

---

## Setup (once, by a developer)

1. Install ACF Pro 6.1+ (or ACF + ACF to REST API).
2. Create a Page titled **Calculate**, slug **`calculate`**.
3. **Custom Fields → Tools → Import** `acf-field-group.json`.
4. Field group location: **Page = Calculate**.
5. Confirm **Show in REST API** is on.
6. After import, re-select the Calculate page in Location if needed (ACF stores a page ID).
7. Set `VITE_WP_API_URL` on the React host.

If WordPress is unreachable, the site still works using built-in fallback content.

---

## Field structure (technical)

ACF groups returned in REST look like:

```json
{
  "acf": {
    "hero": { "badge": "...", "title_line1": "...", "cta_label": "..." },
    "stats": [{ "value": "104", "label": "weeks max entitlement" }],
    "sample": { "amount": 3200, "current_week": 40 },
    "industries": [{ "name": "Healthcare & Care" }],
    "section": { "kicker": "...", "title": "..." },
    "form": { "name_label": "...", "submit_label": "..." },
    "salary": { "label": "...", "placeholder": "3200", "min": 0, "max": 100000, "step": 1 },
    "hours": { "label": "...", "default_value": "40", "min": 1, "max": 60 },
    "rules": { "year1_percent": 100, "year2_percent": 70, "max_weeks": 104 },
    "result": { "year1_title": "Year 1 · {percent}% of gross (statutory)" },
    "how_it_works_section": { "kicker": "...", "title": "..." },
    "how_it_works": [{ "number": "01", "title": "...", "description": "..." }],
    "policy_cta": { "title": "...", "description": "..." },
    "disclaimer_text": "..."
  }
}
```

React maps this in `src/pages/calculate/useCalculatorContent.js` (also accepts older flat field names).
