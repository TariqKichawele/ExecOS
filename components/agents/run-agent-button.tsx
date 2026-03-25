"use client";

import { Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type RunAgentButtonProps = {
  /** When true, both Gmail and Google Calendar are disconnected — button stays inactive */
  disabled?: boolean;
  isPaidUser: boolean;
  freeManualRunsUsed: number;
  freeManualRunLimit: number;
};

const RunAgentButton = ({
  disabled,
  isPaidUser,
  freeManualRunsUsed,
  freeManualRunLimit,
}: RunAgentButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const isDisabled = disabled || isPending;
  const freeRemaining = Math.max(0, freeManualRunLimit - freeManualRunsUsed);

  const handleRunAgent = async () => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/agent/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const msg =
            typeof result.message === "string"
              ? result.message
              : "Agent run failed";
          setErrorMessage(msg);
          if (response.status !== 403) {
            console.error("Agent run failed", result);
          }
          return;
        }

        router.refresh();
      } catch (error) {
        console.error("Agent run error", error);
        setErrorMessage("Something went wrong. Try again.");
      }
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        className="w-full"
        variant="outline"
        onClick={handleRunAgent}
        disabled={isDisabled}
      >
        {isPending ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            Running Agent...
          </>
        ) : (
          "Run Agent Now"
        )}
      </Button>
      {!isPaidUser && (
        <p className="text-muted-foreground text-center text-xs">
          Trial runs: {freeRemaining} of {freeManualRunLimit} left
        </p>
      )}
      {errorMessage ? (
        <p className="text-center text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default RunAgentButton;
