"use client";
import React from "react";
import ProgressBar from "@/components/ProgressBar";
import CriticalIssuesMeetings from "@/components/CriticalIssuesMeetings";
import { SheetPercentage } from "@/lib/types";
// import { PipelineComponent } from "./PipelineComponent";

interface DashboardSectionProps {
  pipelineProgress: SheetPercentage[];
  onboardedProgress: SheetPercentage[];
  outsourcingProgress: SheetPercentage[];
}

export default function DashboardSection({
  pipelineProgress,
  onboardedProgress,
  outsourcingProgress,
}: DashboardSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {/* Column 1: Critical Issues / Upcoming Meetings */}
        <div className="w-full">
          <CriticalIssuesMeetings />
        </div>
        {/* Column 2: Onboarded */}
        <div className="w-full bg-white border-2 border-gray-300 shadow-md p-4 rounded">
          {/* <h2 className="text-2xl font-bold mb-4">Onboarded</h2> */}
          <div className="space-y-4">
            {onboardedProgress.map((item, index) => (
              <a
                href={item.url}
                key={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProgressBar
                  sheetName={item.name}
                  progress={item.progress}
                  index={index}
                />
              </a>
            ))}
          </div>
        </div>
        {/* Column 3: Outsourcing */}
        <div className="w-full bg-white border-2 border-gray-300 shadow-md p-4 rounded">
          {/* <h2 className="text-2xl font-bold mb-4">Outsourcing</h2> */}
          <div className="space-y-4">
            {outsourcingProgress.map((item, index) => (
              <a
                href={item.url}
                key={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProgressBar
                  sheetName={item.name}
                  progress={item.progress}
                  index={index}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-300 shadow-md p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
        <div className="space-y-4">
          {/* <PipelineComponent pipelineData={pipelineProgress} /> */}
          <div className="space-y-4">
            {pipelineProgress.map((item, index) => (
              <a
                href={item.url}
                key={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ProgressBar
                  sheetName={item.name}
                  progress={item.progress}
                  index={index}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
