import { NextRequest, NextResponse } from "next/server";
import {
  uploadReferImage,
  fetchReferImages,
  deleteReferImage,
  updateReferImage,
  scheduleDeleteReferImage,
  toggleReferImageStatus
} from "@/app/(protected)/services/refer-earns/api";

// GET /api/refer-earns?type=referType
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const images = await fetchReferImages(type);
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch refer images" }, { status: 500 });
  }
}

// POST /api/refer-earns
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Handle file upload with FormData
      const formData = await req.formData();
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const mobileFile = formData.get("mobile") as File | null;
      const webFile = formData.get("web") as File | null;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const uploadData = { type, dimensions, title, companyUrl, mobileFile, webFile };
      const result = await uploadReferImage(uploadData);
      if (result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload refer image" }, { status: 500 });
      }
    } else {
      // Handle JSON body (for non-file uploads)
      const body = await req.json();
      const result = await uploadReferImage(body);
      if (result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload refer image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload refer image" }, { status: 500 });
  }
}

// PUT /api/refer-earns
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Handle file update with FormData
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const activeStr = formData.get("active") as string;
      const mobileFile = formData.get("mobile") as File | null;
      const webFile = formData.get("web") as File | null;
      const mobileUrl = formData.get("mobileUrl") as string;
      const webUrl = formData.get("webUrl") as string;
      const deletionDateStr = formData.get("deletionDate") as string;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      // Handle scheduled delete
      if (deletionDateStr) {
        const result = await scheduleDeleteReferImage(id, type, new Date(deletionDateStr));
        if (result.success) {
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Failed to schedule delete" }, { status: 500 });
      }
      // Handle toggle status (if only active is provided)
      if (activeStr && !title && !companyUrl && !mobileFile && !webFile) {
        const isActive = activeStr === "true";
        const result = await toggleReferImageStatus(id, isActive);
        if (result.success) {
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
      }
      // Handle standard update
      const editedData: { title?: string; companyUrl?: string; active?: boolean } = {};
      if (title) editedData.title = title;
      if (companyUrl) editedData.companyUrl = companyUrl;
      if (activeStr) editedData.active = activeStr === "true";
      const result = await updateReferImage(
        id,
        type,
        dimensions,
        editedData,
        mobileFile,
        webFile,
        mobileUrl === "empty" ? null : mobileUrl,
        webUrl === "empty" ? null : webUrl
      );
      if (result.success) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Failed to update refer image" }, { status: 500 });
    } else {
      // Handle JSON body
      const body = await req.json();
      if (body.scheduleDelete) {
        const { id, type, deletionDate } = body;
        const result = await scheduleDeleteReferImage(id, type, new Date(deletionDate));
        if (result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to schedule delete" }, { status: 500 });
      } else if (body.toggleStatus) {
        const { id, isActive } = body;
        const result = await toggleReferImageStatus(id, isActive);
        if (result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
      } else {
        // Standard update
        const { id, type, dimensions, editedData, mobileUrl, webUrl } = body;
        const result = await updateReferImage(
          id,
          type,
          dimensions,
          editedData,
          null,
          null,
          mobileUrl,
          webUrl
        );
        if (result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to update refer image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update refer image" }, { status: 500 });
  }
}

// DELETE /api/refer-earns?id=referId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteReferImage(id);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete refer image" }, { status: 500 });
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete refer image" }, { status: 500 });
  }
}
