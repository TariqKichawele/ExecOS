import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const monsterrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "ExecOS",
  description: "An Autonomous AI Agent",
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
              &copy; {new Date().getFullYear()} ExecOS
            </footer>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
