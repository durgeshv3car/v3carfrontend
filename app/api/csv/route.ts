import { NextRequest, NextResponse } from "next/server";
import { addcsv } from "@/app/(protected)/services/csv/api";

// POST /api/csv
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Handle file upload with FormData
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 });
      }
      const result = await addcsv(file);
      if (result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: result.error || "Failed to upload file" }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Content-Type must be multipart/form-data for file uploads." }, { status: 400 });
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
