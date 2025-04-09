import Papa from "papaparse";

export interface CriticalData {
  meetings: string[];
  issues: string[];
  meetingLinks: string[];
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
          const meetings: string[] = [];
          const issues: string[] = [];
          const meetingLinks: string[] = [];

          data.forEach((row) => {
            if (row.Meetings && row.Meetings.trim().length > 0) {
              meetings.push(row.Meetings.trim());
            }
            if (row.Issues && row.Issues.trim().length > 0) {
              issues.push(row.Issues.trim());
            }
            if (row.MeetingLinks && row.MeetingLinks.trim().length > 0) {
              meetingLinks.push(row.MeetingLinks.trim());
            }
          });
          console.log(meetingLinks);
          resolve({ meetings, issues, meetingLinks });
        },
        error: reject,
      }
    );
  });
}
