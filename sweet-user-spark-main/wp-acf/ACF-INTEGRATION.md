# Wiring the Calculate page to WordPress + ACF

Every editable string and number on the Calculate page lives in ACF on the
WordPress **Page** with slug `calculate`. React only renders `content`.

```
src/pages/calculate/content.js              ← DEFAULT_CONTENT fallback shape
src/pages/calculate/useCalculatorContent.js ← fetches WP page ACF, merges
src/pages/calculate/entitlement.js          ← maths from content.rules only
src/pages/calculate/CalculatePage.jsx       ← UI, reads only from `content`
src/pages/calculate/components/*            ← section components
```

**One rule:** to change copy, percentages, labels, or defaults — edit ACF,
not React.

## 1. WordPress setup

1. Install **ACF Pro 6.1+** (REST built-in) or free ACF + **ACF to REST API**.
2. Create a Page titled **Calculate** with slug **`calculate`**.
3. **Custom Fields → Tools → Import Field Groups** → upload
   `acf-field-group.json` from this folder.
4. Open the imported field group → **Location** → set
   **Page is equal to Calculate** (re-select the page so ACF stores the page ID).
5. Confirm **Show in REST API** is enabled on the field group.
6. Edit the Calculate page and fill in the tabs (Hero, Stats, Calculator form,
   Calculation rules, Result card, etc.).
7. Verify the REST response:

   ```
   https://your-wp-site.com/wp-json/wp/v2/pages?slug=calculate&_fields=id,slug,acf
   ```

   You should see an array with one page whose `acf` object holds the fields.

## 2. Frontend setup

```
VITE_WP_API_URL=https://your-wp-site.com
# optional override (default: calculate)
# VITE_WP_CALCULATE_SLUG=calculate
```

`useCalculatorContent()` fetches on load and merges over `DEFAULT_CONTENT`.
If the env var is missing, WP is down, or `acf` is empty, the page keeps
working on fallbacks (`isFallback: true`).

## 3. Changing sick-pay percentages (no code deploy)

In the **Calculation rules** tab set:

| Field | Example | Effect |
| --- | --- | --- |
| `rules_year1_percent` | `75` | Year 1 pay = salary × 75%; result title shows 75% |
| `rules_year2_percent` | `50` | Year 2 pay = salary × 50%; result title shows 50% |

Result titles use `{percent}` placeholders (`year1_result_title` /
`year2_result_title`) filled from the **same** rules fields — never duplicated.

Optional aliases `year1_percentage` / `year2_percentage` are only used if the
`rules_*` fields are empty.

## 4. Field → React mapping

| ACF field | → `content.*` |
| --- | --- |
| `hero_*` | `content.hero` |
| `stats` repeater | `content.stats[]` |
| `sample_*` | `content.sampleResult` |
| `industries` | `content.industries[]` |
| `section_*` | `content.section` |
| `calculator_salary_*` / `calculator_hours_*` / other `calculator_*` | `content.calculator` |
| `rules_year1_percent` (or `year1_percentage`) | `content.rules.year1Percent` |
| `rules_year2_percent` (or `year2_percentage`) | `content.rules.year2Percent` |
| `rules_max_weeks` | `content.rules.maxWeeks` |
| `rules_waiting_days` | `content.rules.waitingDays` |
| `rules_min_wage_monthly` | `content.rules.minWageMonthly` |
| `rules_linked_absence_days` | `content.rules.linkedAbsenceWindowDays` |
| `year1_result_title` / `year2_result_title` / `result_*` | `content.result` |
| `how_it_works_*` / `how_it_works` | `content.howItWorksSection` / `content.howItWorks` |
| `policy_cta_*` | `content.policyAnalyserCta` |
| `disclaimer_text` | `content.disclaimer` |

## 5. What NOT to touch for content changes

- Do not hardcode percentages, labels, or defaults in JSX.
- `entitlement.js` must only read `rules.*` — never magic numbers.
- Other pages (`contact`, `blog`, `rules`, …) are out of scope for this wiring.
