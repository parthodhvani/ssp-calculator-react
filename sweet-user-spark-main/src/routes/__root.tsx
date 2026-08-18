import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

import {
  ReportProvider,
  useReport,
} from "@/context/ReportContext";

import { NoReportDialog } from "@/components/report/NoReportDialog";
import { ReportDialog } from "@/components/report/ReportDialog";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* WordPress Configuration                                                    */
/* -------------------------------------------------------------------------- */

const WP_API_URL =
  import.meta.env.VITE_WP_API_URL ||
  "https://devwp1.websiteserverhost.biz/ssp-calculator";

const CALCULATE_PAGE_ID =
  import.meta.env.VITE_WP_CALCULATE_PAGE_ID || "130";

/* -------------------------------------------------------------------------- */
/* WordPress ACF Settings Type                                                */
/* -------------------------------------------------------------------------- */

type SiteSettings = {
  site_favicon: string;
  site_header: string;
};

/* -------------------------------------------------------------------------- */
/* Fetch Site Settings from WordPress Page 130                                */
/* -------------------------------------------------------------------------- */

async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/wp-json/wp/v2/pages/${CALCULATE_PAGE_ID}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch WordPress page ${CALCULATE_PAGE_ID}: ${response.status}`
      );
    }

    const data = await response.json();

    return {
      site_favicon: data?.acf?.site_favicon || "",
      site_header: data?.acf?.site_header || "",
    };
  } catch (error) {
    console.error(
      "Failed to fetch WordPress site settings:",
      error
    );

    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 404 Component                                                              */
/* -------------------------------------------------------------------------- */

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error Component                                                            */
/* -------------------------------------------------------------------------- */

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing
          or head back home.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Root Route                                                                 */
/* -------------------------------------------------------------------------- */

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title:
            "Recura — Netherlands sick leave, calculated properly",
        },
        {
          name: "description",
          content:
            "Estimate continued pay during illness under Dutch law (Art. 7:629), check eligibility, and audit your own sick-leave policy.",
        },
        {
          name: "author",
          content: "Recura",
        },
        {
          property: "og:title",
          content:
            "Recura — Netherlands sick leave calculator",
        },
        {
          property: "og:description",
          content:
            "A real euro estimate of your continued pay during illness, with the rules explained.",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],

      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
        },
        {
          rel: "stylesheet",
          href:
            "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
        },
      ],
    }),

    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  });

/* -------------------------------------------------------------------------- */
/* Root Shell                                                                 */
/* -------------------------------------------------------------------------- */

function RootShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>

      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/* -------------------------------------------------------------------------- */
/* Root Component                                                             */
/* -------------------------------------------------------------------------- */

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Fetch WordPress ACF Settings                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadSiteSettings = async () => {
      const settings = await fetchSiteSettings();

      if (mounted && settings) {
        setSiteSettings(settings);
      }
    };

    loadSiteSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Dynamic Favicon                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!siteSettings?.site_favicon) {
      return;
    }

    const faviconUrl = siteSettings.site_favicon;

    /* Remove existing favicon links */
    const existingFavicons = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    existingFavicons.forEach((icon) => {
      icon.remove();
    });

    /* Create favicon */
    const favicon = document.createElement("link");

    favicon.rel = "icon";
    favicon.href = faviconUrl;

    /* Detect favicon type */
    const lowerUrl = faviconUrl.toLowerCase();

    if (lowerUrl.includes(".png")) {
      favicon.type = "image/png";
    } else if (
      lowerUrl.includes(".jpg") ||
      lowerUrl.includes(".jpeg")
    ) {
      favicon.type = "image/jpeg";
    } else if (lowerUrl.includes(".svg")) {
      favicon.type = "image/svg+xml";
    } else if (lowerUrl.includes(".ico")) {
      favicon.type = "image/x-icon";
    }

    document.head.appendChild(favicon);

    return () => {
      favicon.remove();
    };
  }, [siteSettings?.site_favicon]);

  /* ------------------------------------------------------------------------ */
  /* Dynamic Header Text                                                      */
  /* ------------------------------------------------------------------------ */

  const headerText =
    siteSettings?.site_header ||
    "Reference · Statutory Sick-Pay Law";

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <QueryClientProvider client={queryClient}>
      <ReportProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background text-foreground">
            <AppSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur">
                <SidebarTrigger className="-ml-1" />

                <div className="hidden text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground sm:block">
                  {headerText}
                </div>

                <div className="ml-auto">
                  <ReportButton />
                </div>
              </header>

              {/* Nested routes render here */}
              <Outlet />
            </div>
          </div>
        </SidebarProvider>
      </ReportProvider>
    </QueryClientProvider>
  );
}

/* -------------------------------------------------------------------------- */
/* Report Button                                                              */
/* -------------------------------------------------------------------------- */

function ReportButton() {
  const { report, hasReport } = useReport();

  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [showReportDialog, setShowReportDialog] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Open Dialog                                                              */
  /* ------------------------------------------------------------------------ */

  const handleClick = () => {
    setDialogOpen(true);

    if (hasReport) {
      setShowReportDialog(true);
    } else {
      setShowReportDialog(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Close Dialog                                                             */
  /* ------------------------------------------------------------------------ */

  const handleClose = () => {
    setDialogOpen(false);
    setShowReportDialog(false);
  };

  /* ------------------------------------------------------------------------ */
  /* Navigate to Calculator                                                   */
  /* ------------------------------------------------------------------------ */

  const handleGoToCalculator = () => {
    handleClose();

    navigate({
      to: "/calculator",
      state: {
        scrollToCalculator: true,
      },
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <Button
        onClick={handleClick}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        <FileText className="h-4 w-4" />

        Get full report
      </Button>

      {dialogOpen && !showReportDialog && (
        <NoReportDialog
          open={dialogOpen}
          onClose={handleClose}
          onGoToCalculator={handleGoToCalculator}
        />
      )}

      {dialogOpen &&
        showReportDialog &&
        report && (
          <ReportDialog
            open={dialogOpen}
            onClose={handleClose}
            report={report}
          />
        )}
    </>
  );
}