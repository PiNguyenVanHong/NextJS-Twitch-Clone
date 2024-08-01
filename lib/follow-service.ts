import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

export const getFollowedUsers = async () => {
  try {
    const self = await getSelf();

    const followedUsers = db.follow.findMany({
      where: {
        followerId: self.id,
        following: {
          blocking: {
            none: {
              blockedId: self.id
            }
          }
        }
      },
      include: {
        following: {
          include: {
            stream: {
              select: {
                isLive: true,
              }
            },
          }
        },
      },
      orderBy: {
        createdAt: "desc",  
      },
    });

    return followedUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
      return true;
    }

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot follow yourself");
  }

  const exisitingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (exisitingFollow) {
    throw new Error("Already following");
  }

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  return follow;
};

export const unfollowUser = async (id: string) => {
  const self = await getSelf();

  const otherUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!otherUser) {
    throw new Error("User not found");
  }

  if (otherUser.id === self.id) {
    throw new Error("Cannot unfollow yourself");
  }

  const exisingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (!exisingFollow) {
    throw new Error("Not following");
  }

  const follow = await db.follow.delete({
    where: {
      id: exisingFollow.id,
    },
    include: {
      following: true,
    },
  });

  return follow;
};
