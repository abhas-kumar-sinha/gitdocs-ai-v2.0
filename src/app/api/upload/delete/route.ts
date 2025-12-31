import "server-only";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { auth } from "@clerk/nextjs/server";

const cld = cloudinary.v2;

cld.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "Missing publicId" },
        { status: 400 }
      );
    }

    const result = await cld.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
