import Papa from "papaparse";

export interface ERP {
  id: number;
  name: string;
  companies: string[];
  status: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string;
  extendedDate?: string[];
  challenges: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
}

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${process.env.SHEET_ID}/pub?gid=0&single=true&output=csv`;

const safeSplit = (value: string | undefined, separator: RegExp | string) =>
  value
    ? value
        .split(separator)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

const safeString = (value: string | undefined) => (value ? value.trim() : "");

export async function fetchGoogleSheetData(): Promise<ERP[]> {
  const response = await fetch(SHEET_CSV_URL, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  const csvData = await response.text();

  const { data } = Papa.parse<any>(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  const filteredData = data.filter(
    (row) => row.name && row.name.trim().length > 0
  );

  return filteredData.map((row, index) => ({
    id: index + 1,
    name: safeString(row.name),
    companies: safeSplit(
      row.companies.replace(/[\r\n]+/g, "/").replace(/\s*\/\s*/g, "/"),
      "/"
    ),
    status: safeString(row.status),
    currentStatus: safeSplit(row.currentStatus, /\r?\n/),
    nextSteps: safeSplit(row.nextSteps, /\r?\n/),
    targetDate: safeString(row.targetDate),
    extendedDate: safeSplit(row.extendedDate, /\r?\n/),
    challenges: safeSplit(row.challenges, /\r?\n/),
    primaryContacts: safeSplit(row.primaryContacts, "/"),
    businessUsers: safeSplit(row.businessUsers, "/"),
    NDA: safeSplit(row.NDA, /\r?\n/),
    Agreement: safeSplit(row.Agreement, /\r?\n/),
    Commercial: safeSplit(row.Commercial, /\r?\n/),
  }));
}
