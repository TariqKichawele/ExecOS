"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HomeIcon,
  MailIcon,
  MenuIcon,
  SettingsIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Monitoring", href: "/monitoring", icon: MailIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
] as const;

function SidebarBody({
  isPaidUser,
  onNavigate,
  omitLogo = false,
}: {
  isPaidUser: boolean;
  onNavigate?: () => void;
  omitLogo?: boolean;
}) {
  return (
    <>
      {!omitLogo && (
        <div className="logo-container">
          <Link href="/" onClick={onNavigate}>
            <span className="logo-text">ExecOS</span>
          </Link>
          <ThemeToggle className="text-sidebar-foreground" />
        </div>
      )}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={onNavigate}>
            <Button variant="ghost" className="sidebar-nav-button">
              <item.icon className="sidebar-icon" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      {!isPaidUser && (
        <div className="sidebar-section">
          <div className="upgrade-card">
            <div className="upgrade-card-header">
              <ZapIcon className="sidebar-icon" />
              <span className="font-semibold">Upgrade to Pro</span>
            </div>
            <p className="upgrade-card-text">Unlock autonomous AI agent</p>
            <Link
              href="/#pricing"
              onClick={onNavigate}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full justify-center",
              )}
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
      <div className="sidebar-section">
        <div className="user-profile">
          <UserButton />
          {isPaidUser && <Badge className="bg-primary">Pro</Badge>}
        </div>
      </div>
    </>
  );
}

export function MainLayoutClient({
  children,
  isPaidUser,
}: {
  children: React.ReactNode;
  isPaidUser: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className="layout-wrapper"
      data-mobile-nav-open={mobileOpen ? "" : undefined}
    >
      <aside className="sidebar-container">
        <div className="sidebar-inner">
          <SidebarBody isPaidUser={isPaidUser} />
        </div>
      </aside>

      <div className="main-column">
        <header
          className={cn(
            "mobile-top-bar",
            mobileOpen && "max-md:pointer-events-none max-md:invisible max-md:h-0 max-md:min-h-0 max-md:overflow-hidden max-md:border-0 max-md:p-0",
          )}
          aria-hidden={mobileOpen ? true : undefined}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-sidebar-foreground"
            aria-expanded={mobileOpen}
            aria-controls="mobile-app-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
          <Link
            href="/"
            className="logo-text min-w-0 flex-1 truncate"
            onClick={closeMobile}
          >
            ExecOS
          </Link>
          <ThemeToggle className="text-sidebar-foreground" />
        </header>

        <main className="main-content">
          <div className="main-content-inner">{children}</div>
        </main>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <aside
            id="mobile-app-nav"
            className="mobile-nav-drawer"
            aria-label="Main navigation"
          >
            <div className="mobile-nav-drawer-header">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-sidebar-foreground"
                aria-expanded
                aria-controls="mobile-app-nav"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <XIcon className="h-5 w-5" />
              </Button>
              <Link
                href="/"
                className="logo-text min-w-0 flex-1 truncate"
                onClick={closeMobile}
              >
                ExecOS
              </Link>
              <ThemeToggle className="text-sidebar-foreground" />
            </div>
            <div className="sidebar-inner flex min-h-0 flex-1 flex-col overflow-y-auto">
              <SidebarBody
                isPaidUser={isPaidUser}
                onNavigate={closeMobile}
                omitLogo
              />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
