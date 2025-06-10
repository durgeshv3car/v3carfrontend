import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "";
  const res = await fetch(`${BASE_URL}/banner/images/${type}`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let res;
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    res = await fetch(`${BASE_URL}/banner/upload`, {
      method: "POST",
      body: formData,
    });
  } else {
    const body = await req.json();
    res = await fetch(`${BASE_URL}/banner/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let res;
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    res = await fetch(`${BASE_URL}/banner/image`, {
      method: "PUT",
      body: formData,
    });
  } else {
    const body = await req.json();
    res = await fetch(`${BASE_URL}/banner/image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const res = await fetch(`${BASE_URL}/banner/image`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}