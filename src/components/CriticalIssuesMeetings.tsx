"use client";
import { useEffect, useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import { fetchCriticalData, CriticalData } from "@/lib/criticalIssuesData";
import { DATA_REFRESH_INTERVAL } from "@/lib/constants";

export default function CriticalIssuesMeetings() {
  const [data, setData] = useState<CriticalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_ISSUES_CSV_ID}/pub?gid=2019171411&single=true&output=csv`;

  useEffect(() => {
    async function loadIssuesMeetingsData() {
      try {
        const parsedData = await fetchCriticalData(csvUrl);
        if (!parsedData) {
          throw new Error("Failed to fetch or parse data");
        }
        // console.log("Fetched critical data:", parsedData);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching critical data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadIssuesMeetingsData();
    const interval = setInterval(loadIssuesMeetingsData, DATA_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [csvUrl]);

  if (loading) return <p>Loading critical issues and meeting links...</p>;

  // Using only issues and the meeting map
  const issues = data?.issues || [];
  const meetingMap = data?.meetingMap || {};

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
