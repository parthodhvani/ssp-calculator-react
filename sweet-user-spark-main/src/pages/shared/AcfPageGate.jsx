/**
 * Shared loading / error UI when ACF content is not ready.
 */
export function AcfPageGate({ isLoading, error, children, label = "content" }) {
  if (isLoading) {
    return (
      <main className="mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Loading {label}…
        </p>
      </main>
    );
  }

  if (error || !children) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="font-serif text-2xl text-foreground">Couldn’t load {label}</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {error || "No content returned from WordPress. Check ACF fields and page ID in .env."}
        </p>
      </main>
    );
  }

  return children;
}
