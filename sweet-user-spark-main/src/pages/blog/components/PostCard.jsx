/**
 * PostCard.jsx — Blog page
 * A single card in the post grid (everything except the featured post).
 */
import { ArrowUpRight, Clock } from "lucide-react";

/**
 * Decode HTML entities returned by WordPress.
 *
 * Examples:
 * &#8217;  → ’
 * &#8216;  → ‘
 * &#8220;  → “
 * &#8221;  → ”
 * &amp;    → &
 */
function decodeHtmlEntities(text) {
  if (!text) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;

  return textarea.value;
}

export function PostCard({ post }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40">
      
      {/* Tag + Date */}
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-md bg-secondary px-2 py-0.5 font-mono uppercase tracking-wider text-secondary-foreground">
          {decodeHtmlEntities(post.tag)}
        </span>

        <span className="text-muted-foreground">
          {decodeHtmlEntities(post.date)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
        {decodeHtmlEntities(post.title)}
      </h3>

      {/* Excerpt / Content */}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {decodeHtmlEntities(post.excerpt)}
      </p>

      {/* Read time + Arrow */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {decodeHtmlEntities(post.read)}
        </span>

        <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </article>
  );
}

export default PostCard;