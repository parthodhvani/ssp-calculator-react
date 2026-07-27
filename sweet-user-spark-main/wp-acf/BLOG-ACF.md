# Blog page — WordPress / ACF guide

Same pattern as Calculate and Eligibility, plus an ACF **relationship** field for which posts appear on the landing page.

## Connect React

Endpoint (replace `{ID}` with your Blog page ID):

```
https://devwp1.websiteserverhost.biz/ssp-calculator/wp-json/wp/v2/pages/{ID}
```

In `sweet-user-spark-main/.env`:

```
VITE_WP_API_URL=https://devwp1.websiteserverhost.biz/ssp-calculator
VITE_WP_BLOG_PAGE_ID=<your-blog-page-id>
# Optional if ID unset:
# VITE_WP_BLOG_SLUG=blog
```

Restart `npm run dev` after changing `.env`.

## Setup (once)

1. Create a **Blog** page in WordPress (slug `blog`). Note the page ID.
2. **Custom Fields → Tools → Import** `blog-acf-field-group.json` (imports **Blog Page** + **Blog Post Meta**).
3. Location for Blog Page group: **Page = Blog** (re-select after import if needed).
4. Enable **Show in REST API** on both field groups.
5. Create normal WordPress **Posts**. Optionally fill **Tag** and **Read time** (Blog Post Meta sidebar).
6. On the Blog page, use the **Related posts** relationship to pick & order posts (first = featured).
7. Set `VITE_WP_BLOG_PAGE_ID` to that page ID.

## Tabs / fields

| Area | What you edit |
| --- | --- |
| **① Page header** | Kicker, title, description |
| **② Featured quote** | Quote on the featured card |
| **③ Posts** | Relationship → select & order posts |
| **Post sidebar** | `tag`, `read_time` on each post |

## Mapping

| ACF / WP | React `content` |
| --- | --- |
| `header.*` | `kicker`, `title`, `description` |
| `featured_quote` | `featuredQuote` |
| `posts` (relationship) | `posts[]` — first item is featured |
| Post title / excerpt / date | `title`, `excerpt`, `date` |
| Post `acf.tag` / `acf.read_time` | `tag`, `read` |

If the relationship returns IDs only, React also fetches `/wp-json/wp/v2/posts?include=…&_embed`.
