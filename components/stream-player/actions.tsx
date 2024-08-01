"use client";

import { redirect } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { onFollow, onUnfollow } from "@/actions/follow";

import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isHost: boolean;
}

const Actions = ({ hostIdentity, isFollowing, isHost }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const { userId } = useAuth();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(hostIdentity)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const toggleFollow = () => {
    if (!userId) {
      toast.warning("You have to sign in to follow!!!");
      redirect("/");
      // router.push("/sign-in");
    }

    if (isHost) return;

    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <Button
      disabled={isPending || isHost}
      className="w-full lg:w-auto"
      onClick={toggleFollow}
      variant={"primary"}
      size={"sm"}
    >
      <Heart
        className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")}
      />
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default Actions;

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24" />
    )
}