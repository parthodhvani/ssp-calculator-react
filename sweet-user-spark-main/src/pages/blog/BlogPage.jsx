/**
 * BlogPage.jsx
 * ---------------------------------------------------------------------------
 * The "/blog" route. Header + posts from ACF via useBlogContent()
 * (relationship field on the WP Blog page). First related post = featured.
 * ---------------------------------------------------------------------------
 */
import { useBlogContent } from "./useBlogContent";
import { FeaturedPost } from "./components/FeaturedPost";
import { PostCard } from "./components/PostCard";

export function BlogPage() {
  const { content } = useBlogContent();
  const [featured, ...rest] = content.posts;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        {content.kicker}
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
        {content.title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {content.description}
      </p>

      {featured ? (
        <FeaturedPost post={featured} quote={content.featuredQuote} />
      ) : null}

      {rest.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {rest.map((post) => (
            <li key={post.id ?? post.slug ?? post.title}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}

export default BlogPage;
