import { NextResponse } from "next/server";
import { fetchGoogleSheetData } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const erps = await fetchGoogleSheetData();
  // console.log("hey its me in main route:", erps);
  return NextResponse.json(erps);
}
