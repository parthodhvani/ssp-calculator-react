# Wiring this calculator to WordPress + ACF

This app was originally a Lovable-generated **TanStack Start** SPA with all
copy and numbers hardcoded in JSX. It's been refactored into three layers so
you (the WP dev) never need to touch a `.tsx` file to change content:

```
src/config/calculatorContent.ts   ← TypeScript shape of every editable field
                                     + hardcoded fallback values
src/hooks/useCalculatorContent.ts ← fetches ACF data over REST, maps it onto
                                     the shape above, falls back safely
src/lib/entitlement.ts            ← the actual maths, reading numbers from
                                     content.rules instead of magic numbers
src/routes/index.tsx              ← pure UI, reads only from `content`
```

If you only remember one thing: **every string/number in the UI now comes
from one `content` object.** To change anything, change the ACF field, not
the code.

## 1. WordPress setup (5 steps)

1. Install ACF Pro (6.1+) — it ships with REST API support built in. If
   you're on the free version, install the **ACF to REST API** plugin.
2. Go to **Custom Fields → Field Groups → Tools → Import Field Groups** and
   upload `acf-field-group.json` from this folder. This creates every field
   used by the calculator with the correct names.
3. Register an **Options Page** so the content isn't tied to a specific
   post/page (add to your theme's `functions.php` or a small plugin):

   ```php
   if (function_exists('acf_add_options_page')) {
       acf_add_options_page([
           'page_title' => 'Calculator Settings',
           'menu_title' => 'Calculator Settings',
           'menu_slug'  => 'acf-options-calculator-settings',
           'capability' => 'edit_posts',
       ]);
   }
   ```

   (The field group's `location` rule in the JSON already targets this slug.)

4. Go to **Calculator Settings** in the WP admin sidebar and fill in the
   fields — hero copy, the 3 stats, the industry list, and importantly the
   **Calculation rules** tab (year 1 / year 2 percentages, max weeks, waiting
   days, minimum wage). These are the numbers that change when Dutch law
   changes — now editable without a code deploy.

5. Confirm the REST endpoint returns data. Visit in a browser:

   ```
   https://your-wp-site.com/wp-json/acf/v3/options/options
   ```

   You should see a JSON object with an `"acf"` key containing everything
   you just filled in.

## 2. Frontend setup (1 step)

Create a `.env` file (or set the env var in your hosting platform) with your
WordPress URL:

```
VITE_WP_API_URL=https://your-wp-site.com
```

That's it — `useCalculatorContent()` in `src/hooks/useCalculatorContent.ts`
picks this up automatically, fetches on page load, and merges it over the
built-in defaults. If the env var is missing or WordPress is unreachable,
the page silently uses the hardcoded fallback values in
`calculatorContent.ts` — it never breaks.

## 3. Field reference

| ACF field name              | Type              | Drives                                   |
|------------------------------|-------------------|-------------------------------------------|
| `hero_badge`                 | Text              | Small badge above the H1                  |
| `hero_title_line1`           | Text              | H1 line 1                                 |
| `hero_title_highlight`       | Text              | H1 highlighted/underlined phrase          |
| `hero_title_suffix`          | Text              | H1 trailing text                          |
| `hero_description`           | Textarea          | Paragraph under the H1                    |
| `hero_cta_label`              | Text              | "Start calculating" button text           |
| `stats` (repeater, 3 rows)   | stat_value/label  | The 104 / 70% / €2,437 strip              |
| `sample_amount`               | Number            | Illustrative €3,200/mo preview card       |
| `sample_period_label`         | Text              | "Year 1 · Weeks 1–52" caption             |
| `sample_current_week`         | Number            | Progress bar position in preview card     |
| `industries` (repeater)      | industry_name     | Options in the "Industry / sector" select |
| `rules_year1_percent`         | Number            | Year 1 payout % — **the actual maths**    |
| `rules_year2_percent`         | Number            | Year 2 payout % — **the actual maths**    |
| `rules_max_weeks`             | Number            | Statutory max weeks (currently 104)       |
| `rules_waiting_days`          | Number            | Unpaid waiting day(s) at start            |
| `rules_min_wage_monthly`      | Number            | Statutory minimum wage, shown in hero     |
| `rules_linked_absence_days`   | Number            | Window (days) that links two absences     |
| `how_it_works` (repeater, 3) | step_number/title/description | The 3-card "How it works" section |
| `policy_cta_title`            | Text              | Sidebar CTA heading                       |
| `policy_cta_description`      | Text              | Sidebar CTA subtext                       |
| `disclaimer_text`             | Text              | "Illustrative estimate — not legal advice" line |

## 4. If you're NOT using an Options Page

Some setups prefer attaching fields to a normal Page (e.g. the homepage)
instead of an Options Page. To do that:

1. In the field group's `location` rule, change it to target a specific
   page (ACF UI: "Page is equal to [Homepage]").
2. In `src/hooks/useCalculatorContent.ts`, change `ACF_ENDPOINT` to:
   ```
   `${WP_API_URL}/wp-json/acf/v3/pages/{PAGE_ID}`
   ```
3. Everything else (the mapping function, the component) stays the same —
   the response shape (`{ acf: {...} }`) is identical either way.

## 5. What NOT to touch

- `src/routes/index.tsx` should stay presentation-only — no hardcoded
  copy/numbers. If you find yourself typing a string directly into that
  file, it probably belongs in `calculatorContent.ts` + the ACF field group
  instead.
- `src/lib/entitlement.ts` is pure calculation logic with no ACF/React
  dependency — safe to unit test on its own.
