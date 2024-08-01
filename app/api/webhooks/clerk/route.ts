import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextApiResponse } from "next";

import { db } from "@/lib/db";
import { Stream } from "@prisma/client";
import { resetIngresses } from "@/actions/ingress";

export async function POST(req: Request, res: NextApiResponse) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id") as string;
  const svix_timestamp = headerPayload.get("svix-timestamp") as string;
  const svix_signature = headerPayload.get("svix-signature") as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: " + err, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    
      await db.user.create({
        data: {
          externalUserId: payload.data.id,
          username: payload.data.username,
          imageUrl: payload.data.image_url,
          stream: {
            create: {
              name: `${payload.data.username}'s stream`, 
            }
          }
        },
      });
  }

  if (eventType === "user.updated") {
    
    const currentUser = await db.user.findUnique({
      where: {
        externalUserId: payload.data.id,
      },
    });

    if (!currentUser) {
      return new Response("User not found", { status: 404 });
    }

    await db.user.update({
      where: {
        externalUserId: payload.data.id,
      },
      data: {
        username: payload.data.username,
        imageUrl: payload.data.image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    await resetIngresses(payload.data.id);

    await db.user.delete({
      where: {
        externalUserId: payload.data.id,
      },
    });
  }

  return new Response("", { status: 200 });
}
