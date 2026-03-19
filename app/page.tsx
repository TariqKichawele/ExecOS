import { SignUpButton, SignInButton, Show, UserButton, PricingTable, } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="logo-container">
            <Link href="/">
              <span className="logo-text">ExecOS</span>
            </Link>
            <Show when="signed-in">
              <div className="nav-actions">
                <Link href={'/dashboard'}>
                  <Button variant="ghost">
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <div className="nav-actions">
                <SignInButton />
                <SignUpButton />
              </div>
            </Show>
          </div>
        </div>
      </header>
      <section className="section-heading">
        <h2>Simple, Transparent Pricing</h2>
        <PricingTable 
          appearance={{

          }}
        />
      </section>
    </div>
  );
}
