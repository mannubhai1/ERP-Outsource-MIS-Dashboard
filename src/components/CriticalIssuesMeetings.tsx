"use client";
import { useEffect, useState } from "react";
import { AlertCircle, Calendar } from "lucide-react";
import { fetchCriticalData, CriticalData } from "@/lib/criticalIssuesData";

export default function CriticalIssuesMeetings() {
  const [data, setData] = useState<CriticalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_ISSUES_CSV_ID}/pub?gid=2019171411&single=true&output=csv`;

  useEffect(() => {
    async function fetchData() {
      try {
        const parsedData = await fetchCriticalData(csvUrl);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching critical data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [csvUrl]);

  if (loading) return <p>Loading critical issues and meetings...</p>;

  const meetings = data?.meetings || [];
  const issues = data?.issues || [];
  const meetingLinks = data?.meetingLinks || [];

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Critical Issues / Upcoming Meetings
      </h2>
      <div className="flex flex-col gap-4">
        {/* Meetings Section */}
        <div className="p-2 border-b border-gray-300">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Calendar className="mt-1 mr-2 text-green-500" />
            Upcoming Meetings
          </h3>
          {meetings.length > 0 ? (
            <ul className="space-y-2">
              {meetings.map((meeting, index) => {
                const link = meetingLinks[index];
                const isLinkEmpty = !link || link.trim() === "";

                return (
                  <li
                    key={index}
                    className="flex items-start text-lg md:text-xl"
                  >
                    <span className="leading-relaxed">{meeting}</span>
                    {isLinkEmpty ? (
                      <span className="text-sm text-gray-400 ml-2">
                        No meeting link attached
                      </span>
                    ) : (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-2"
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
