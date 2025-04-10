"use client";
import useSWR from "swr";
import Papa from "papaparse";
import { AlertCircle, Calendar } from "lucide-react";
import { DATA_REFRESH_INTERVAL } from "@/lib/constants";

// Define the CriticalData interface
export interface CriticalData {
  issues: string[];
  meetingMap: Record<string, string>;
}

// Create a fetcher function that retrieves and parses the CSV data
const fetchCriticalData = async (csvUrl: string): Promise<CriticalData> => {
  const response = await fetch(csvUrl, { cache: "no-store" });
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<{ Meetings: string; Issues: string; MeetingLinks: string }>(
      csvText,
      {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data;
          const issues: string[] = [];
          const meetingMap: Record<string, string> = {};

          rows.forEach((row) => {
            const meeting = row.Meetings?.trim() || "";
            const issue = row.Issues?.trim() || "";
            const meetingLink = row.MeetingLinks?.trim() || "";
            if (meeting.length > 0) {
              meetingMap[meeting] = meetingLink;
            }
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
};

export default function CriticalIssuesMeetings() {
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_ISSUES_CSV_ID}/pub?gid=2019171411&single=true&output=csv`;

  // Use SWR to fetch the critical data
  const { data, error } = useSWR<CriticalData>(csvUrl, fetchCriticalData, {
    refreshInterval: DATA_REFRESH_INTERVAL, // e.g. 10000 (10 secs)
    dedupingInterval: 5000,
  });

  if (error) return <p>Error loading data.</p>;
  if (!data) return <p>Loading critical issues and meeting links...</p>;

  const { issues, meetingMap } = data;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Critical Issues / Upcoming Meetings
      </h2>
      <div className="flex flex-col gap-4">
        {/* Meeting Links Section */}
        <div className="p-2 border-b border-gray-300">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Calendar className="mt-1 mr-2 text-green-500" />
            Upcoming Meetings
          </h3>
          {Object.keys(meetingMap).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(meetingMap).map(([meeting, link], index) => {
                const isLinkEmpty = !link || link.trim() === "";
                return (
                  <li
                    key={index}
                    className="flex items-center text-lg md:text-xl"
                  >
                    <span className="leading-relaxed">{meeting}</span>
                    {isLinkEmpty ? (
                      <span className="ml-auto text-sm text-gray-400">
                        No meeting link attached
                      </span>
                    ) : (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-blue-500 hover:underline"
                      >
                        Meeting Link
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming meetings</p>
          )}
        </div>
        {/* Issues Section */}
        <div className="p-2">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <AlertCircle className="mt-1 mr-2 text-red-500" />
            Critical Issues
          </h3>
          {issues.length > 0 ? (
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start text-lg md:text-xl">
                  <span className="leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No critical issues</p>
          )}
        </div>
      </div>
    </div>
  );
}
