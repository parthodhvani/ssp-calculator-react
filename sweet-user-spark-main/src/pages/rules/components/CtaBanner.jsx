/**
 * CtaBanner.jsx — Rules page
 * Bottom call-to-action; labels/links come from ACF (with defaults).
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { resolveHref } from "../content";

function SmartLink({ href, className, children }) {
  const to = resolveHref(href, "/");
  const isExternal = /^https?:\/\//i.test(to);
  const isInternal = to.startsWith("/") && !isExternal;

  if (isInternal) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className={className}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function CtaBanner({
  title,
  body,
  primaryLabel = "Open calculator",
  primaryLink = "/",
  secondaryLabel = "Analyse a policy",
  secondaryLink = "/policy-analyser",
}) {
  return (
    <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <SmartLink
          href={primaryLink}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {primaryLabel} <ArrowRight className="h-4 w-4" />
        </SmartLink>
        <SmartLink
          href={secondaryLink}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
        >
          {secondaryLabel}
        </SmartLink>
      </div>
    </div>
  );
}

export default CtaBanner;
