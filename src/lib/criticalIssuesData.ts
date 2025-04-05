import Papa from "papaparse";

export interface CriticalData {
  meetings: string[];
  issues: string[];
}

export async function fetchCriticalData(csvUrl: string): Promise<CriticalData> {
  const response = await fetch(csvUrl, { next: { revalidate: 0 } });
  const csvText = await response.text();
  // console.log("Raw CSV Text:", csvText);

  return new Promise<CriticalData>((resolve, reject) => {
    Papa.parse<{ Meetings: string; Issues: string }>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        // console.log("Parsed Data:", data);
        const meetings: string[] = [];
        const issues: string[] = [];
        data.forEach((row) => {
          if (row.Meetings && row.Meetings.trim().length > 0) {
            meetings.push(row.Meetings.trim());
          }
          if (row.Issues && row.Issues.trim().length > 0) {
            issues.push(row.Issues.trim());
          }
        });
        // console.log("Meetings:", meetings);
        // console.log("Issues:", issues);
        resolve({ meetings, issues });
      },
      error: reject,
    });
  });
}
