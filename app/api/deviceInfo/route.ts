import { NextRequest, NextResponse } from "next/server";
import { fetchDevices, deleteDevice } from "@/app/(protected)/services/deviceInfo/api";

// GET /api/deviceInfo
export async function GET() {
  try {
    const devices = await fetchDevices();
    return NextResponse.json(devices);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }
}

// DELETE /api/deviceInfo?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteDevice(id);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to delete device" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 });
  }
}
