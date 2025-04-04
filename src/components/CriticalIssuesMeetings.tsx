"use client";
import React from "react";
import { AlertCircle, Calendar } from "lucide-react";

interface DataItem {
  type: "issue" | "meeting" | string;
  content: string;
}

interface CriticalIssuesMeetingsProps {
  data: DataItem[];
}

/*
Sample : 
[
  { "type": "issue", "content": "Server downtime causing delays." },
  { "type": "meeting", "content": "Project kickoff meeting at 10 AM." }
]

*/
export default function CriticalIssuesMeetings({
  data,
}: CriticalIssuesMeetingsProps) {
  const issues = data.filter((item) => item.type === "issue");
  const meetings = data.filter((item) => item.type === "meeting");

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Critical Issues / Upcoming Meetings
      </h2>
      <div className="flex flex-col gap-4">
        {/* Meetings Section */}
        <div className="p-2 border-b border-gray-300">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            {/* <Calendar className="mr-2 text-green-500" /> */}
            Upcoming Meetings
          </h3>
          {meetings.length > 0 ? (
            <ul className="space-y-2">
              {meetings.map((meeting, index) => (
                <li key={index} className="flex items-start text-lg md:text-xl">
                  <Calendar className="mt-1 mr-2 text-green-500" />
                  <span className="leading-relaxed">{meeting.content}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming meetings</p>
          )}
        </div>
        {/* Issues Section */}
        <div className="p-2">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            {/* <AlertCircle className="mr-2 text-red-500" /> */}
            Critical Issues
          </h3>
          {issues.length > 0 ? (
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start text-lg md:text-xl">
                  <AlertCircle className="mt-1 mr-2 text-red-500" />
                  <span className="leading-relaxed">{issue.content}</span>
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
