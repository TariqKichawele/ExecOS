"use client";

import { Loader2Icon } from 'lucide-react';
import { useTransition } from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type RunAgentButtonProps = {
  /** When true, both Gmail and Google Calendar are disconnected — button stays inactive */
  disabled?: boolean;
};

const RunAgentButton = ({ disabled }: RunAgentButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const isDisabled = disabled || isPending;

    const handleRunAgent = async () => {
        startTransition(async () => {
            try {
                const response = await fetch("/api/agent/run", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const result = await response.json();

                if (!response) {
                    console.error("Agent run failed", result.error);
                }

                router.refresh();
            } catch (error) {
                console.error("Agent run error", error);
                return;
            }
        })
    }

  return (
    <Button
        className={'w-full'}
        variant={'outline'}
        onClick={handleRunAgent}
        disabled={isDisabled}
    >
        {isPending ? (
            <>
                <Loader2Icon className='w-4 h-4 animate-spin'/>
                Running Agent...
            </>
        ) : (
            "Run Agent Now"
        )}
    </Button>
  )
}

export default RunAgentButton