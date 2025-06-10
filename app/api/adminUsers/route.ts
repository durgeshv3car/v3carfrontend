import { NextRequest, NextResponse } from "next/server";
import { fetchUsers, updateUser, deleteUser } from "@/app/(protected)/services/adminUsers/api";

// GET /api/adminUsers
export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// PUT /api/adminUsers?id=... (update user)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const { name, email, role, permissions } = body;
    const result = await updateUser(id, name, email, role, permissions);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/adminUsers?id=...&adminId=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const adminId = searchParams.get("adminId");
    if (!id || !adminId) {
      return NextResponse.json({ error: "ID and adminId are required" }, { status: 400 });
    }
    const result = await deleteUser(id, adminId);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
