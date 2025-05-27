

// app/api/category/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const response = await axios.get(`${BACKEND_API}/category`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error proxying GET /category:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const response = await axios.post(`${BACKEND_API}/category`, { title });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Error proxying POST /category:", error);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}
