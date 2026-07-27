/**
 * ResultBanner.jsx — Eligibility page
 * Shown once all questions are answered. Copy + CTA links from ACF.
 */
import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
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

export function ResultBanner({ allYes, anyNo, outcomes }) {
  return (
    <div
      className={`mt-8 rounded-2xl border p-6 sm:p-8 ${
        allYes ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <div className="flex items-start gap-3">
        {allYes ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
        )}
        <div>
          <h2 className="font-serif text-2xl text-foreground">
            {allYes ? outcomes.allYesTitle : outcomes.notCoveredTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {allYes
              ? outcomes.allYesBody
              : anyNo
                ? outcomes.anyNoBody
                : outcomes.grayZoneBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <SmartLink
              href={outcomes.primaryCtaLink}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {outcomes.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
            </SmartLink>
            <SmartLink
              href={outcomes.secondaryCtaLink}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {outcomes.secondaryCtaLabel}
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultBanner;
