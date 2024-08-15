"use server";

import { clerkClient, currentUser, User } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function getStreamToken() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

  if (!streamApiKey || !streamApiSecret)
    throw new Error("Stream API Key or Secret is not set");

  const user = await currentUser();
  console.log("Logged in user", user);

  if (!user?.id) throw new Error("User is not logged in");

  const client = new StreamClient(streamApiKey, streamApiSecret);
  const issueAt = Math.floor(Date.now() / 1000) - 60;
  console.log("Token issued at", issueAt);
  const expirationAt = Math.floor(Date.now() / 1000) + 60 * 60;
  console.log("Token expires at", expirationAt);

  const token = client.createToken(user.id, expirationAt, issueAt);
  console.log("Generated token", token);
  return token;
}

export default async function getUserIds (emailAddress: string[]) {
  const {data} = await clerkClient.users.getUserList({emailAddress});
  return data.map(user => user.id);
}