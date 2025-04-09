import Papa from "papaparse";

export interface CriticalData {
  issues: string[];
  meetingMap: Record<string, string>;
}

export async function fetchCriticalData(csvUrl: string): Promise<CriticalData> {
  const response = await fetch(csvUrl, { cache: "no-store" });
  const csvText = await response.text();

  return new Promise<CriticalData>((resolve, reject) => {
    Papa.parse<{ Meetings: string; Issues: string; MeetingLinks: string }>(
      csvText,
      {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          const issues: string[] = [];
          const meetingMap: Record<string, string> = {};

          data.forEach((row) => {
            const meeting = row.Meetings?.trim() || "";
            const issue = row.Issues?.trim() || "";
            const meetingLink = row.MeetingLinks?.trim() || "";

            // Only add a meeting to the map if it's non-empty.
            if (meeting.length > 0) {
              meetingMap[meeting] = meetingLink;
            }
            // Add non-empty issues.
            if (issue.length > 0) {
              issues.push(issue);
            }
          });
          resolve({ issues, meetingMap });
        },
        error: reject,
      }
    );
  });
}
