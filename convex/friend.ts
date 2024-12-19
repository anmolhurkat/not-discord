import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const createFriend = mutation({
  args: {
    userId: v.string(),
    friendId: v.string(),
    name: v.string(),
    username: v.string(),
    model: v.string(),
    personality: v.string(),
    friendImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => {
          return q.eq(q.field("userId"), args.userId);
        })
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      const friend = await ctx.db
        .query("friends")
        .filter((q) => {
          return q.eq(q.field("username"), args.username);
        })
        .first();

      if (friend) {
        throw new ConvexError("Username already exists");
      }

      await ctx.db.insert("friends", {
        creatorId: user._id,
        friendId: args.friendId,
        name: args.name,
        username: args.username,
        model: args.model,
        personality: args.personality,
        friendImageUrl: args.friendImageUrl,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  },
});

export const getFriendsForUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => {
        return q.eq(q.field("userId"), args.userId);
      })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const friendIds = await ctx.db
      .query("friends")
      .filter((q) => {
        return q.eq(q.field("creatorId"), user._id);
      })
      .order("desc")
      .collect();

    return Promise.all(
      friendIds.map(async (friendId) => {
        const friends = await ctx.db.get(friendId._id);
        return friends;
      })
    );
  },
});