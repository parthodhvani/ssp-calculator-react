import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calculator,
  ShieldCheck,
  BookOpen,
  Newspaper,
  Mail,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const WP_API_URL = import.meta.env.VITE_WP_API_URL;
const PAGE_ID = import.meta.env.VITE_WP_CALCULATE_PAGE_ID || "130";

const primary = [
  {
    title: "Calculator",
    url: "/",
    icon: Calculator,
  },
  {
    title: "Eligibility",
    url: "/eligibility",
    icon: ShieldCheck,
  },
];

const secondary = [
  {
    title: "Rules",
    url: "/rules",
    icon: BookOpen,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: Newspaper,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: Mail,
  },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  const [headerLogo, setHeaderLogo] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHeaderLogo() {
      try {
        if (!WP_API_URL) {
          console.error("VITE_WP_API_URL is not defined.");
          setLogoLoading(false);
          return;
        }

        const apiUrl = WP_API_URL.replace(/\/+$/, "");

        const response = await fetch(
          `${apiUrl}/wp-json/wp/v2/pages/${PAGE_ID}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `WordPress API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("WordPress page response:", data);
        console.log("ACF fields:", data?.acf);

        const logo = data?.acf?.main_header_logo;

        console.log("main_header_logo:", logo);

        let logoUrl = null;

        /*
         * ACF image field can return:
         *
         * 1. String URL
         * 2. Image object
         * 3. Attachment ID
         */

        if (typeof logo === "string" && logo.trim() !== "") {
          logoUrl = logo.trim();
        } else if (
          logo &&
          typeof logo === "object" &&
          typeof logo.url === "string"
        ) {
          logoUrl = logo.url.trim();
        }

        if (!logoUrl) {
          console.warn(
            `No valid main_header_logo found for WordPress page ${PAGE_ID}`
          );

          setHeaderLogo(null);
          setLogoError(true);
          return;
        }

        console.log("Final logo URL:", logoUrl);

        setHeaderLogo(logoUrl);
        setLogoError(false);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch WordPress header logo:", error);

        setHeaderLogo(null);
        setLogoError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLogoLoading(false);
        }
      }
    }

    fetchHeaderLogo();

    return () => {
      controller.abort();
    };
  }, []);

  const isActive = (url) => {
    if (url === "/") {
      return currentPath === "/";
    }

    return (
      currentPath === url ||
      currentPath.startsWith(`${url}/`)
    );
  };

  return (
    <Sidebar collapsible="icon">
      {/* ==============================
          SIDEBAR HEADER
      ============================== */}

      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          to="/"
          className="
            flex
            items-center
            px-2
            py-2
            group-data-[collapsible=icon]:justify-center
          "
        >
          {/* ==============================
              LOGO
          ============================== */}

          {headerLogo && !logoError ? (
            <img
              src={headerLogo}
              alt="SSP Calculator"
              className="
                block
                shrink-0
                rounded-md
                object-contain
              "
              loading="eager"
              decoding="async"
              onLoad={() => {
                console.log(
                  "WordPress logo loaded successfully:",
                  headerLogo
                );
              }}
              onError={(event) => {
                console.error(
                  "WordPress logo failed to load:",
                  headerLogo
                );

                console.error(
                  "Image element:",
                  event.currentTarget
                );

                setLogoError(true);
              }}
            />
          ) : (
            <img
              src="https://devwp1.websiteserverhost.biz/ssp-calculator/wp-content/uploads/2026/08/images-2.jpg"
              alt="SSP Calculator"
              className="
                block
                shrink-0
                rounded-md
                object-contain
              "
              loading="eager"
              decoding="async"
            />
          )}
        </Link>
      </SidebarHeader>

      {/* ==============================
          SIDEBAR CONTENT
      ============================== */}

      <SidebarContent>
        {/* ==============================
            TOOLS
        ============================== */}

        <SidebarGroup>
          <SidebarGroupLabel>
            Tools
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {primary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ==============================
            LEARN
        ============================== */}

        <SidebarGroup>
          <SidebarGroupLabel>
            Learn
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {secondary.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ==============================
          SIDEBAR FOOTER
      ============================== */}

      <SidebarFooter
        className="
          border-t
          border-sidebar-border/60
          px-3
          py-3
          text-[11px]
          leading-relaxed
          text-sidebar-foreground/70
          group-data-[collapsible=icon]:hidden
        "
      >
        <p
          className="
            font-mono
            uppercase
            tracking-wider
            text-sidebar-foreground/50
          "
        >
          Ref
        </p>

        <p>Dutch Civil Code Art. 7:629</p>
        <p>Minimum wage · July 2026</p>
      </SidebarFooter>
    </Sidebar>
  );
}