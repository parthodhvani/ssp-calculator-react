/**
 * FeaturedPost.jsx — Blog page
 * The large "hero" article card at the top of the post list.
 */
import { ArrowUpRight, Clock } from "lucide-react";

/**
 * Decode HTML entities returned by WordPress.
 *
 * Handles:
 * &#8220; → “
 * &#8221; → ”
 * &#8216; → ‘
 * &#8217; → ’
 * &amp;   → &
 *
 * Also handles double/triple encoded entities.
 */
function decodeHtmlEntities(text) {
  if (!text) return "";

  let decoded = String(text);
  const textarea = document.createElement("textarea");

  // Decode multiple times in case the API encoded the value more than once
  for (let i = 0; i < 3; i++) {
    textarea.innerHTML = decoded;

    const result = textarea.value;

    if (result === decoded) {
      break;
    }

    decoded = result;
  }

  return decoded;
}

export function FeaturedPost({ post, quote }) {
  return (
    <article className="group mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40 sm:grid-cols-[1.4fr_1fr] sm:p-8">
      <div>
        {/* Tag + Date + Read time */}
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono uppercase tracking-wider text-accent">
            {decodeHtmlEntities(post.tag)}
          </span>

          <span className="text-muted-foreground">
            {decodeHtmlEntities(post.date)}
          </span>

          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {decodeHtmlEntities(post.read)}
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-4 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
          {decodeHtmlEntities(post.title)}
        </h2>

        {/* Excerpt */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {decodeHtmlEntities(post.excerpt)}
        </p>

        {/* Read article */}
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
          Read the article{" "}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Quote */}
      <div
        aria-hidden
        className="hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-accent/60 p-8 sm:flex sm:items-end"
      >
        <blockquote className="font-serif text-xl leading-snug text-primary-foreground">
          "{decodeHtmlEntities(quote)}"
        </blockquote>
      </div>
    </article>
  );
}

export default FeaturedPost;