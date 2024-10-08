import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
});

export const authConfig = {
  providers: [
    {
      domain: "https://growing-woodcock-56.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
};