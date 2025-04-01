import Papa from "papaparse";
import { ERP, ERPInput } from "@/lib/types";

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${process.env.MAIN_SHEET_ID}/pub?gid=0&single=true&output=csv`;

const safeSplit = (
  value: string | undefined,
  separator: RegExp | string
): string[] =>
  value
    ? value
        .split(separator)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

const safeString = (value: string | undefined): string =>
  value ? value.trim() : "";

export async function fetchGoogleSheetData(): Promise<ERP[]> {
  const response = await fetch(SHEET_CSV_URL, {
    next: { revalidate: 0 },
  });

  const csvData = await response.text();

  const { data } = Papa.parse<ERPInput>(csvData, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const filteredData = data.filter(
    (row) => row.name && row.name.trim().length > 0
  );

  return filteredData.map((row, index) => ({
    id: index + 1,
    name: safeString(row.name),
    companies: safeSplit(
      row.companies?.replace(/[\r\n]+/g, "/").replace(/\s*\/\s*/g, "/"),
      "/"
    ),
    lastUpdated: safeString(row.lastUpdated),
    status: safeString(row.status),
    currentStatus: safeSplit(row.currentStatus, /\r?\n/),
    nextSteps: safeSplit(row.nextSteps, /\r?\n/),
    targetDate: safeSplit(row.targetDate, /\r?\n/),
    extendedDate: row.extendedDate ? safeSplit(row.extendedDate, /\r?\n/) : [],
    challenges: safeSplit(row.challenges, /\r?\n/),
    primaryContacts: safeSplit(row.primaryContacts, "/"),
    businessUsers: safeSplit(row.businessUsers, "/"),
    NDA: safeSplit(row.NDA, /\r?\n/),
    Agreement: safeSplit(row.Agreement, /\r?\n/),
    Commercial: safeSplit(row.Commercial, /\r?\n/),
    Brochures: safeSplit(row.Brochures, /\r?\n/),
    MOMs: safeSplit(row.MOMs, /\r?\n/),
    implementationPlan: safeSplit(row.implementationPlan, /\r?\n/),
    Correspondence: safeString(row.Correspondence),
  }));
}
