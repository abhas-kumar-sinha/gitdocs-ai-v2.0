import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  const evt = await verifyWebhook(req);
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });

      console.log("✅ User created:", id);
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("User creation failed", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    await prisma.user.delete({
      where: { clerkId: id },
    });

    console.log("🗑️ User deleted:", id);
  }

  return new Response("Webhook processed", { status: 200 });
}
