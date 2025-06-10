import { NextRequest, NextResponse } from "next/server";
import { fetchNotifications } from "@/app/(protected)/services/notifications/app/api";

// GET /api/notifications/app
export async function GET(req: NextRequest) {
  try {
    const notifications = await fetchNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
