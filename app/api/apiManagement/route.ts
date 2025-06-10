import { NextRequest, NextResponse } from "next/server";
import { fetchApis, addApi, updateApi, deleteAPi } from "@/app/(protected)/services/apiManagement/api";

// GET /api/apiManagement
export async function GET() {
  try {
    const apis = await fetchApis();
    return NextResponse.json(apis);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch APIs" }, { status: 500 });
  }
}

// POST /api/apiManagement
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const result = await addApi(name);
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to add API" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add API" }, { status: 500 });
  }
}

// PUT /api/apiManagement?id=... (update API)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const { name, isActive } = body;
    const result = await updateApi(id, name, isActive);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to update API" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update API" }, { status: 500 });
  }
}

// DELETE /api/apiManagement?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteAPi(id);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete API" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete API" }, { status: 500 });
  }
}
