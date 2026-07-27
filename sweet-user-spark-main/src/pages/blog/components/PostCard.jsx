/**
 * PostCard.jsx — Blog page
 * A single card in the post grid (everything except the featured post).
 */
import { ArrowUpRight, Clock } from "lucide-react";

export function PostCard({ post }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40">
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-md bg-secondary px-2 py-0.5 font-mono uppercase tracking-wider text-secondary-foreground">
          {post.tag}
        </span>
        <span className="text-muted-foreground">{post.date}</span>
      </div>
      <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {post.read}
        </span>
        <ArrowUpRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </article>
  );
}

export default PostCard;
