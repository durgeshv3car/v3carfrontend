import { NextRequest, NextResponse } from "next/server";
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
  toggleServiceStatus
} from "@/app/(protected)/services/ourServices/api";

// GET /api/ourServices?type=serviceType
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "";
    const services = await fetchServices(type);
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/ourServices
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimension") as string;
      const title = formData.get("title") as string;
      const fieldDescription = formData.get("description") as string;
      const buttonType = formData.get("buttonType") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const companyUrl = formData.get("companyUrl") as string;
      const joiningFee = formData.get("joiningFee") as string;
      const annualFee = formData.get("annualFee") as string;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const formDataObj: any = {
        "Title": title,
        fieldDescription,
        "Button Name": buttonType,
        "Company URL": companyUrl,
        "Joining Fee": joiningFee,
        "Annual Fee": annualFee
      };
      const result = await addService(type, dimensions, formDataObj, mobileFile, webFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: result?.message || "Failed to add service" }, { status: 500 });
      }
    } else {
      const body = await req.json();
      const { type, dimensions, formData: formDataObj, mobileFile, webFile } = body;
      const result = await addService(type, dimensions, formDataObj, mobileFile, webFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: result?.message || "Failed to add service" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 });
  }
}

// PUT /api/ourServices
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const type = formData.get("type") as string;
      const dimensionStr = formData.get("dimension") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const buttonType = formData.get("buttonType") as string;
      const companyUrl = formData.get("companyUrl") as string;
      const joiningFee = formData.get("joiningFee") as string;
      const annualFee = formData.get("annualFee") as string;
      const activeStr = formData.get("active") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const mobileUrl = formData.get("mobileUrl") as string | null;
      const webUrl = formData.get("webUrl") as string | null;
      let dimension;
      try {
        dimension = dimensionStr ? JSON.parse(dimensionStr) : {};
      } catch (e) {
        dimension = {};
      }
      const editedData: any = {};
      if (title) editedData.title = title;
      if (description) editedData.description = description;
      if (buttonType) editedData.buttonType = buttonType;
      if (companyUrl) editedData.companyUrl = companyUrl;
      if (joiningFee) editedData.joiningFee = joiningFee;
      if (annualFee) editedData.annualFee = annualFee;
      if (activeStr !== undefined) editedData.active = activeStr === "true";
      const result = await updateService(
        id,
        type,
        dimension,
        editedData,
        mobileFile,
        webFile,
        mobileUrl === null ? undefined : mobileUrl,
        webUrl === null ? undefined : webUrl
      );
      if (result && result.success) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: result?.message || "Failed to update service" }, { status: 500 });
    } else {
      const body = await req.json();
      if (body.toggleStatus) {
        const { id, type, value } = body;
        const result = await toggleServiceStatus(id, type, value);
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: result?.message || "Failed to toggle status" }, { status: 500 });
      } else {
        const { id, type, dimension, editedData, mobileFile, webFile, mobileUrl, webUrl } = body;
        const result = await updateService(
          id,
          type,
          dimension,
          editedData,
          mobileFile,
          webFile,
          mobileUrl,
          webUrl
        );
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: result?.message || "Failed to update service" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/ourServices?id=serviceId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteService(id);
    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result?.message || "Failed to delete service" }, { status: 500 });
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
