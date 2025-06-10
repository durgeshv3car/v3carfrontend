import { NextRequest, NextResponse } from "next/server";
import { fetchLoans, updateLoan, deleteLoan } from "@/app/(protected)/services/loans/api";

// GET /api/loans
export async function GET() {
  try {
    const loans = await fetchLoans();
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch loans" }, { status: 500 });
  }
}

// PUT /api/loans?id=...
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const data = await req.json();
    const result = await updateLoan(userId, data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update loan" }, { status: 500 });
  }
}

// DELETE /api/loans?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteLoan(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete loan" }, { status: 500 });
  }
}
