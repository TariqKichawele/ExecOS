"use client";

import { Button } from "@/components/ui/button";
import type { GoogleProvider } from "@/lib/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DisconnectButtonProps = {
  provider: GoogleProvider;
};

export function DisconnectButton({ provider }: DisconnectButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDisconnect() {
    if (
      !confirm(
        "Disconnect this account? You can reconnect anytime from this page.",
      )
    ) {
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`/api/integrations/${provider}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Disconnect failed: ${res.status}`);
      }
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Could not disconnect. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleDisconnect}
    >
      {pending ? "Disconnecting…" : "Disconnect"}
    </Button>
  );
}
