import { NextRequest, NextResponse } from "next/server";
import {
  updateMoney,
  addMoney,
  fetchMoney,
  deleteMoney,
  toggleMoneyStatus
} from "@/app/(protected)/services/moneySmart/api";

// GET /api/moneySmart
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // fetchMoney in api.ts does not take a type argument, so ignore type
    const images = await fetchMoney();
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch moneySmart images" }, { status: 500 });
  }
}

// POST /api/moneySmart
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const detailDescription = formData.get("detailDescription") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const redirectUrl = formData.get("redirectUrl") as string;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      // Map to addMoney(type, dimensions, formData, mobileFile, webFile)
      const formDataObj: any = {
        Title: title,
        Description: description,
        "Category Name": category,
        fieldDescription: detailDescription,
        "Company URL": redirectUrl,
      };
      const result = await addMoney(type, dimensions, formDataObj, mobileFile, webFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload moneySmart image" }, { status: 500 });
      }
    } else {
      const body = await req.json();
      // Expecting: type, dimensions, formData, mobileFile, webFile
      const { type, dimensions, formData: formDataObj, mobileFile, webFile } = body;
      const result = await addMoney(type, dimensions, formDataObj, mobileFile, webFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: "Failed to upload moneySmart image" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload moneySmart image" }, { status: 500 });
  }
}

// PUT /api/moneySmart
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const detailDescription = formData.get("detailDescription") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const activeStr = formData.get("active") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const mobileUrl = formData.get("mobileUrl") as string | null;
      const webUrl = formData.get("webUrl") as string | null;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const editedData: any = {};
      if (title) editedData.title = title;
      if (description) editedData.description = description;
      if (detailDescription) editedData.detailDescription = detailDescription;
      if (companyUrl) editedData.companyUrl = companyUrl;
      if (activeStr !== undefined) editedData.active = activeStr === "true";
      // updateMoney(id, type, dimensions, editedData, mobileFile, webFile, mobileUrl, webUrl)
      const result = await updateMoney(
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
      return NextResponse.json({ error: "Failed to update moneySmart image" }, { status: 500 });
    } else {
      const body = await req.json();
      const { id, type, dimensions, editedData, mobileFile, webFile, mobileUrl, webUrl } = body;
      const result = await updateMoney(
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
      return NextResponse.json({ error: "Failed to update moneySmart image" }, { status: 500 });
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update moneySmart image" }, { status: 500 });
  }
}

// PATCH for toggling status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, value } = body;
    const result = await toggleMoneyStatus(id, value);
    if (result && result.success) return NextResponse.json({ success: true });
    return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to toggle status" }, { status: 500 });
  }
}

// DELETE /api/moneySmart?id=moneySmartId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteMoney(id);
    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete moneySmart image" }, { status: 500 });
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete moneySmart image" }, { status: 500 });
  }
}
