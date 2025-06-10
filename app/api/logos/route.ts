import { NextRequest, NextResponse } from "next/server";
import {
  uploadLogoImage,
  fetchLogoImages,
  deleteLogoImage,
  updateLogoImage,
  scheduleDeleteLogoImage,
  toggleLogoImageStatus
} from "@/app/(protected)/services/logos/api";

// GET /api/logos?type=logoType
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const images = await fetchLogoImages(type);
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch logo images" }, { status: 500 });
  }
}

// POST /api/logos
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const uploadData = {
        type,
        dimensions,
        title,
        companyUrl,
        mobileFile,
        webFile
      };
      const result = await uploadLogoImage(uploadData);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload logo image" }, { status: 500 });
      }
    } else {
      const body = await req.json();
      const result = await uploadLogoImage(body);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload logo image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload logo image" }, { status: 500 });
  }
}

// PUT /api/logos
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const activeStr = formData.get("active") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const mobileUrl = formData.get("mobileUrl") as string | null;
      const webUrl = formData.get("webUrl") as string | null;
      const deletionDateStr = formData.get("deletionDate") as string;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      if (deletionDateStr) {
        const result = await scheduleDeleteLogoImage(id, type, new Date(deletionDateStr));
        if (result && result.success) {
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Failed to schedule delete" }, { status: 500 });
      }
      if (activeStr && !title && !companyUrl && !mobileFile && !webFile) {
        const isActive = activeStr === "true";
        const result = await toggleLogoImageStatus(id, isActive);
        if (result && result.success) {
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
      }
      const editedData: { title?: string; companyUrl?: string; active?: boolean } = {};
      if (title) editedData.title = title;
      if (companyUrl) editedData.companyUrl = companyUrl;
      if (activeStr) editedData.active = activeStr === "true";
      const result = await updateLogoImage(
        id,
        type,
        dimensions,
        editedData,
        mobileFile,
        webFile,
        mobileUrl === null ? undefined : mobileUrl,
        webUrl === null ? undefined : webUrl
      );
      if (result && result.success) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Failed to update logo image" }, { status: 500 });
    } else {
      const body = await req.json();
      if (body.scheduleDelete) {
        const { id, type, deletionDate } = body;
        const result = await scheduleDeleteLogoImage(id, type, new Date(deletionDate));
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to schedule delete" }, { status: 500 });
      } else if (body.toggleStatus) {
        const { id, isActive } = body;
        const result = await toggleLogoImageStatus(id, isActive);
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
      } else {
        const { id, type, dimensions, editedData, mobileFile, webFile, mobileUrl, webUrl } = body;
        const result = await updateLogoImage(
          id,
          type,
          dimensions,
          editedData,
          mobileFile,
          webFile,
          mobileUrl,
          webUrl
        );
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to update logo image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update logo image" }, { status: 500 });
  }
}

// DELETE /api/logos?id=logoId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteLogoImage(id);
    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete logo image" }, { status: 500 });
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete logo image" }, { status: 500 });
  }
}
