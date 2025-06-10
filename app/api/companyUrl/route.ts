import { NextRequest, NextResponse } from "next/server";
import {
  fetchcompanyUrl,
  addcompanyUrl,
  updatecompanyUrl,
  deletecompanyUrl
} from "@/app/(protected)/services/companyUrl/api";

// GET /api/companyUrl
export async function GET() {
  try {
    const urls = await fetchcompanyUrl();
    return NextResponse.json(urls);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch company URLs" }, { status: 500 });
  }
}

// POST /api/companyUrl
export async function POST(req: NextRequest) {
  try {
    const { companyUrl } = await req.json();
    if (!companyUrl) {
      return NextResponse.json({ error: "companyUrl is required" }, { status: 400 });
    }
    const result = await addcompanyUrl(companyUrl);
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to add companyUrl" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add companyUrl" }, { status: 500 });
  }
}

// PUT /api/companyUrl?id=...
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const { companyUrl } = await req.json();
    if (!companyUrl) {
      return NextResponse.json({ error: "companyUrl is required" }, { status: 400 });
    }
    const result = await updatecompanyUrl(id, companyUrl);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to update companyUrl" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update companyUrl" }, { status: 500 });
  }
}

// DELETE /api/companyUrl?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deletecompanyUrl(id);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete companyUrl" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete companyUrl" }, { status: 500 });
  }
}
