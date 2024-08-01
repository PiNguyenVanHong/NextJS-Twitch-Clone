'use client';

import { useTransition } from "react";
import { toast } from "sonner";

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";

interface UnblockButtonProps {
    userId: string;
};

export const UnblockButton = ({
    userId,
}: UnblockButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        startTransition(() => {
            onUnblock(userId)
                .then((rst) => toast.success(`user ${rst.blocked.username} unblocked`))
                .catch(() => toast.error("Something went wrong"));
        });
    }

    return (
        <Button
        className="text-blue-500 w-full"
            disabled={isPending}
            onClick={onClick}
            variant={"link"}
            size={"sm"}
        >
            Unblock
        </Button>
    )
}