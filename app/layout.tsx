import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const monsterrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "ExecOS",
  description: "An Autonomous AI Agent",
  icons: {
    icon: "/execos.png",
    apple: "/execos.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monsterrat.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('exec-os-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <ThemeProvider>
          <ClerkProvider appearance={{ theme: shadcn }}>
            {children}
            <footer className="mt-auto w-full p-4 text-center text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span>&copy; {new Date().getFullYear()} ExecOS</span>
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </footer>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
