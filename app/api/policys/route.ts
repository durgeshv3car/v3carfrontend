import { NextRequest, NextResponse } from "next/server";
import { fetchpolicy, addpolicy, updatepolicy, deletepolicy } from "@/app/(protected)/services/policys/api";

// GET /api/policys
export async function GET() {
  try {
    const policys = await fetchpolicy();
    return NextResponse.json(policys);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }
}

// POST /api/policys
export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    const result = await addpolicy(title, description);
    if (result.success) {
      return NextResponse.json(result.data, { status: 201 });
    } else {
      return NextResponse.json({ error: "Failed to add policy" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to add policy" }, { status: 500 });
  }
}

// PUT /api/policys?id=...
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    const result = await updatepolicy(id, title, description);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}

// DELETE /api/policys?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deletepolicy(id);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
  }
}
