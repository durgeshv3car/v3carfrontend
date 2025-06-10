import { NextResponse } from "next/server";
import { fetchLogs } from "@/app/(protected)/services/userLogs/api";

// GET /api/userLogs
export async function GET() {
  try {
    const logs = await fetchLogs();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user logs" }, { status: 500 });
  }
}
