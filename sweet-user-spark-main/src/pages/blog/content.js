/**
 * content.js — Blog page
 * ---------------------------------------------------------------------------
 * Demo posts. In a real headless setup, replace `DEFAULT_CONTENT.posts` with
 * a fetch to WP's native posts REST endpoint:
 *   GET {WP_URL}/wp-json/wp/v2/posts?_embed
 * and map { date, title, excerpt, tag, read } from the WP post object
 * (see /wp-acf/ACF-INTEGRATION.md for the pattern used elsewhere on this
 * site).
 * ---------------------------------------------------------------------------
 */

export const DEFAULT_CONTENT = {
  kicker: "Writing · Updated weekly",
  title: "Notes from the sick-leave desk",
  description:
    "Case law, CAO changes and the payroll edge cases we keep running into — written for employees and HR teams that want the actual answer.",
  posts: [
    {
      date: "12 July 2026",
      read: "6 min",
      tag: "Case law",
      title: "When a bedrijfsarts disagrees with your GP: your options in 2026",
      excerpt:
        "A second opinion is now a statutory right, but only within a narrow window. Here's what changed in April and how to use it.",
    },
    {
      date: "28 June 2026",
      read: "4 min",
      tag: "CAO",
      title: "Metalektro CAO 2026: what actually improved for sick pay",
      excerpt:
        "The new agreement lifts year-two pay to 90% and waives waiting days for chronic conditions. We break down who benefits.",
    },
    {
      date: "10 June 2026",
      read: "8 min",
      tag: "Deep dive",
      title: "Payrolling, uitzend and the 104-week clock",
      excerpt:
        "If your contract keeps flipping between agencies, when does the two-year continued-pay period actually start?",
    },
    {
      date: "22 May 2026",
      read: "3 min",
      tag: "Explainer",
      title: "Why 'ziek uit dienst' still catches people out",
      excerpt:
        "Falling ill in the last month of a fixed-term contract has a very specific outcome — and most employees don't know it.",
    },
  ],
  featuredQuote:
    "The second opinion right is only useful if you know the seven-day window exists.",
};
