import { SignUp } from "@clerk/nextjs";
import { AppLogo } from "@/components/app-logo";

export default function Page() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl justify-start">
          <AppLogo imageClassName="size-10 sm:size-11" />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}