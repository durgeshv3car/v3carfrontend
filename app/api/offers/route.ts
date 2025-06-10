import { NextRequest, NextResponse } from "next/server";
import {
  fetchOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  toggleHomeStatus
} from "@/app/(protected)/services/offers/api";

// GET /api/offers
export async function GET(req: NextRequest) {
  try {
    const offers = await fetchOffers();
    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

// POST /api/offers
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const buttonType = formData.get("buttonType") as string;
      const detailDescription = formData.get("detailDescription") as string;
      const brandName = formData.get("brandName") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const bannerFile = (formData.get("banner") as File) || undefined;
      const brandLogoFile = (formData.get("brandLogo") as File) || undefined;
      const redirectUrl = formData.get("redirectUrl") as string;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const formDataObj: any = {
        "Title": title,
        "Description": description,
        "Category Name": category,
        "Button Name": buttonType,
        fieldDescription: detailDescription,
        "Brand Name": brandName,
        "Company URL": redirectUrl
      };
      const result = await addOffer(type, dimensions, formDataObj, mobileFile, webFile, bannerFile, brandLogoFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: result?.message || "Failed to upload offer" }, { status: 500 });
      }
    } else {
      const body = await req.json();
      const { type, dimensions, formData: formDataObj, mobileFile, webFile, bannerFile, brandLogoFile } = body;
      const result = await addOffer(type, dimensions, formDataObj, mobileFile, webFile, bannerFile, brandLogoFile);
      if (result && result.success) {
        return NextResponse.json(result.data, { status: 201 });
      } else {
        return NextResponse.json({ error: result?.message || "Failed to upload offer" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to upload offer" }, { status: 500 });
  }
}

// PUT /api/offers
export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const type = formData.get("type") as string;
      const dimensionsStr = formData.get("dimensions") as string;
      const title = formData.get("title") as string;
      const buttonType = formData.get("buttonType") as string;
      const brandName = formData.get("brandName") as string;
      const category = formData.get("category") as string;
      const description = formData.get("description") as string;
      const detailDescription = formData.get("detailDescription") as string;
      const mobileFile = (formData.get("mobile") as File) || undefined;
      const webFile = (formData.get("web") as File) || undefined;
      const bannerFile = (formData.get("banner") as File) || undefined;
      const brandLogoFile = (formData.get("brandLogo") as File) || undefined;
      const redirectUrl = formData.get("redirectUrl") as string;
      const isActiveStr = formData.get("isActive") as string;
      const isHomeStr = formData.get("isHome") as string;
      const mobileUrl = formData.get("mobileUrl") as string | null;
      const webUrl = formData.get("webUrl") as string | null;
      const bannerUrl = formData.get("bannerUrl") as string | null;
      const logoUrl = formData.get("logoUrl") as string | null;
      let dimensions;
      try {
        dimensions = dimensionsStr ? JSON.parse(dimensionsStr) : {};
      } catch (e) {
        dimensions = {};
      }
      const editedData: any = {};
      if (title) editedData.title = title;
      if (buttonType) editedData.buttonType = buttonType;
      if (brandName) editedData.brandName = brandName;
      if (category) editedData.category = category;
      if (description) editedData.description = description;
      if (detailDescription) editedData.detailDescription = detailDescription;
      if (redirectUrl) editedData.redirectUrl = redirectUrl;
      if (isActiveStr !== undefined) editedData.isActive = isActiveStr === "true";
      if (isHomeStr !== undefined) editedData.isHome = isHomeStr === "true";
      const result = await updateOffer(
        id,
        type,
        dimensions,
        editedData,
        mobileFile,
        webFile,
        bannerFile,
        brandLogoFile,
        mobileUrl === null ? undefined : mobileUrl,
        webUrl === null ? undefined : webUrl,
        bannerUrl === null ? undefined : bannerUrl,
        logoUrl === null ? undefined : logoUrl
      );
      if (result && result.success) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: result?.message || "Failed to update offer" }, { status: 500 });
    } else {
      const body = await req.json();
      if (body.toggleStatus) {
        const { id, isActive } = body;
        const result = await toggleOfferStatus(id, isActive);
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: result?.message || "Failed to toggle status" }, { status: 500 });
      } else if (body.toggleHome) {
        const { id, isHome } = body;
        const result = await toggleHomeStatus(id, isHome);
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: result?.message || "Failed to toggle home status" }, { status: 500 });
      } else {
        const { id, type, dimensions, editedData, mobileFile, webFile, bannerFile, brandLogoFile, mobileUrl, webUrl, bannerUrl, logoUrl } = body;
        const result = await updateOffer(
          id,
          type,
          dimensions,
          editedData,
          mobileFile,
          webFile,
          bannerFile,
          brandLogoFile,
          mobileUrl,
          webUrl,
          bannerUrl,
          logoUrl
        );
        if (result && result.success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: result?.message || "Failed to update offer" }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

// DELETE /api/offers?id=offerId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteOffer(id);
    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result?.message || "Failed to delete offer" }, { status: 500 });
    }
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
