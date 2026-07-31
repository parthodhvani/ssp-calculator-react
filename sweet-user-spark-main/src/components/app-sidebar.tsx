import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calculator,
  ShieldCheck,
  FileSearch,
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const primary = [
  { title: "Calculator", url: "/", icon: Calculator },
  { title: "Eligibility", url: "/eligibility", icon: ShieldCheck },
  //{ title: "Policy analyser", url: "/policy-analyser", icon: FileSearch },
];

const secondary = [
  { title: "Rules", url: "/rules", icon: BookOpen },
  { title: "Blog", url: "/blog", icon: Newspaper },
  { title: "Contact", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (r) => r.location.pathname,
  });
  const isActive = (url: string) =>
    url === "/" ? currentPath === "/" : currentPath.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-2 py-2 group-data-[collapsible=icon]:justify-center"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-sidebar-primary font-serif text-sm font-bold text-sidebar-primary-foreground">
            R
          </span>
          <span className="font-serif text-lg leading-none tracking-tight group-data-[collapsible=icon]:hidden">
            Recura
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupLabel>Learn</SidebarGroupLabel>
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

      <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-3 text-[11px] leading-relaxed text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
        <p className="font-mono uppercase tracking-wider text-sidebar-foreground/50">
          Ref
        </p>
        <p>Dutch Civil Code Art. 7:629</p>
        <p>Minimum wage · July 2026</p>
      </SidebarFooter>
    </Sidebar>
  );
}