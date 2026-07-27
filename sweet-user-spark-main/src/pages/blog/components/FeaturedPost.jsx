/**
 * FeaturedPost.jsx — Blog page
 * The large "hero" article card at the top of the post list.
 */
import { ArrowUpRight, Clock } from "lucide-react";

export function FeaturedPost({ post, quote }) {
  return (
    <article className="group mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40 sm:grid-cols-[1.4fr_1fr] sm:p-8">
      <div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono uppercase tracking-wider text-accent">
            {post.tag}
          </span>
          <span className="text-muted-foreground">{post.date}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.read}
          </span>
        </div>
        <h2 className="mt-4 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
          Read the article{" "}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
      <div
        aria-hidden
        className="hidden rounded-xl bg-gradient-to-br from-primary/90 via-primary to-accent/60 p-8 sm:flex sm:items-end"
      >
        <blockquote className="font-serif text-xl leading-snug text-primary-foreground">
          "{quote}"
        </blockquote>
      </div>
    </article>
  );
}

export default FeaturedPost;
