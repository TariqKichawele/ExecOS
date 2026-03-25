import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onClick?: () => void;
};

export function AppLogo({
  href = "/",
  className,
  imageClassName,
  priority = false,
  onClick,
}: AppLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex min-w-0 shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        className={cn(
          "relative inline-block size-8 shrink-0 overflow-hidden rounded-full sm:size-9",
          imageClassName,
        )}
      >
        <Image
          src="/execos.png"
          alt=""
          fill
          sizes="48px"
          className="object-cover dark:hidden"
          priority={priority}
        />
        <Image
          src="/execos-dark.png"
          alt=""
          fill
          sizes="48px"
          className="hidden object-cover dark:block"
          priority={priority}
        />
      </span>
      <span className="logo-text min-w-0 truncate">ExecOS</span>
    </Link>
  );
}
