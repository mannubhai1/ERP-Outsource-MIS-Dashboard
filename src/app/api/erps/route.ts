import { NextResponse } from "next/server";
import { fetchGoogleSheetData } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const erps = await fetchGoogleSheetData();

  if (!erps) {
    return NextResponse.json({ message: "No data found" }, { status: 404 });
  }
  return NextResponse.json(erps);
}
