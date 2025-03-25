import { NextResponse } from "next/server";
import { fetchGoogleSheetData } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const erps = await fetchGoogleSheetData();
  const erp = erps.find((e) => e.id === parseInt(id));
  // console.log("hey its me :", erps);

  if (!erp) {
    return NextResponse.json({ message: "ERP not found" }, { status: 404 });
  }

  return NextResponse.json(erp);
}
