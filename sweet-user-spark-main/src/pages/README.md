# Page-wise component structure (JSX)

This folder replaces the old pattern where every page lived as one giant
`.tsx` file directly inside `src/routes/`. Each page now has its own folder:

```
src/pages/
  calculate/
    CalculatePage.jsx        ← composes the page, holds shared state
    content.js                ← all copy/config, ACF-field-mapped
    useCalculatorContent.js    ← WP REST fetch + fallback (already wired)
    entitlement.js             ← pure calculation logic
    components/
      HeroSection.jsx
      CalculatorForm.jsx
      ResultSummary.jsx
      HowItWorks.jsx
  contact/
    ContactPage.jsx
    content.js
    components/
      ContactInfoList.jsx
      ContactForm.jsx
  blog/
    BlogPage.jsx
    content.js
    components/
      FeaturedPost.jsx
      PostCard.jsx
  policy-analyser/
    PolicyAnalyserPage.jsx
    content.js
    components/
      UploadPanel.jsx
      FindingsPanel.jsx
  rules/
    RulesPage.jsx
    content.js
    components/
      RuleCard.jsx
      CtaBanner.jsx
  eligibility/
    EligibilityPage.jsx
    content.js
    components/
      QuestionItem.jsx
      ResultBanner.jsx
```

Shared, cross-page bits live in `src/components/shared/` (`FormField.jsx`,
`StatRow.jsx`).

## Why this layout

- **One responsibility per file.** Each section of a page (hero, form,
  results, cards…) is its own component, instead of one 400+ line file with
  everything inline. Easier to find the bit you need to change, easier to
  hand a single component to another dev.
- **All copy in `content.js`.** Every page's headline text, labels, and
  demo data live in a plain JS object at the top of its folder — no more
  digging through JSX to find a string to edit.
- **Plain JSX, no TypeScript, everywhere.** All page-level code and the
  shadcn/ui primitives in `src/components/ui/` are now `.jsx`/`.js` with
  type annotations and interfaces removed. The only `.tsx` files left in
  the project are `src/routes/*.tsx` — TanStack Router's file-based
  routing/type-generation requires that exact folder + extension, so those
  stay as thin `.tsx` wrappers (see "Routing" below). `components.json`
  (`"tsx": false`) and `tsconfig.json` have been updated so future
  `npx shadcn add …` runs and editor tooling both work against `.jsx`.

## Wiring pages up to WordPress

Only the **Calculate** page is currently wired to a real WP endpoint —
`useCalculatorContent.js` fetches an ACF Options Page and falls back to
`content.js` if WordPress is unreachable (see `/wp-acf/ACF-INTEGRATION.md`
and `/wp-acf/acf-field-group.json`).

The other five pages (`contact`, `blog`, `policy-analyser`, `rules`,
`eligibility`) currently just import `DEFAULT_CONTENT` directly from their
`content.js`. To make any of them dynamic:

1. Copy the pattern in `calculate/useCalculatorContent.js` — create a
   `useXContent.js` hook in that page's folder that fetches from WP
   (an ACF Options Page, an ACF field group on a normal Page, or — for the
   blog specifically — WP's native `/wp-json/wp/v2/posts` endpoint) and
   merges the result on top of `DEFAULT_CONTENT`.
2. In the page's top-level `*.jsx` file, swap
   `const content = DEFAULT_CONTENT;` for
   `const { content } = useXContent();`.
3. Nothing in `components/` needs to change — they already just read
   whatever `content` object they're handed as a prop.

## Routing

`src/routes/*.tsx` files are now thin wrappers only — they still have to
stay `.tsx` because TanStack Router's file-based routing/type-generation
expects them there, but each one now just imports and renders the matching
page component, e.g.:

```tsx
// src/routes/contact.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/contact/ContactPage";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});
```

If you're stripping this project down to a plain headless front-end
without TanStack Router, you can delete `src/routes/` entirely and mount
the six `*Page.jsx` components directly on whatever router you use instead
(React Router, Next.js pages, etc.) — none of the page/component code
depends on TanStack Router except for the `<Link>` components used for
in-app navigation, which can be swapped 1:1 for your router's link
component.
