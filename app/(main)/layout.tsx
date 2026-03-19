import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { HomeIcon, MailIcon, SettingsIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { userId, has } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  const isPaidUser = has({ plan: "pro_plan" });

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Monitoring",
      href: "/monitoring",
      icon: MailIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="layout-wrapper">
      <aside className="sidebar-container">
        <div className="sidebar-inner">
          <div className="logo-container">
            <Link href="/">
              <span className="logo-text">ExecOS</span>
            </Link>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <Button variant={"ghost"} className={"sidebar-nav-button"}>
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
                <Button variant={"secondary"} className={"w-full"}>
                  <Link href={"/#pricing"}>Upgrade Now</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <div className="user-profile">
              <UserButton />
              {isPaidUser && <Badge className="bg-primary"> Pro </Badge>}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-content-inner">
        {children}
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;
