import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getOrCreateUser } from "@/db/queries";
import { MainLayoutClient } from "@/components/main-layout-client";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const { userId, has } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";

  await getOrCreateUser(userId, email, name);

  const isPaidUser = has({ plan: "pro_plan" });

  return <MainLayoutClient isPaidUser={isPaidUser}>{children}</MainLayoutClient>;
};

export default MainLayout;
