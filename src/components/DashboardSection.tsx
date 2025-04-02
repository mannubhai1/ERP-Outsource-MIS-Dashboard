"use client";
import React from "react";
import ProgressBar from "@/components/ProgressBar";
import { SheetPercentage } from "@/lib/types";

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
    <div className="flex flex-col sm:flex-row gap-8">
      {/* Pipeline Section */}
      <div className="flex-1 border-2 border-gray-300 p-4 rounded">
        <div className="space-y-4">
          {pipelineProgress.map((item, index) => (
            <a
              href={item.url}
              key={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ProgressBar
                key={item.name}
                sheetName={item.name}
                progress={item.progress}
                index={index}
              />
            </a>
          ))}
        </div>
      </div>
      {/* Onboarded Section */}
      <div className="flex-1 border-2 border-gray-300 p-4 rounded">
        <div className="space-y-4">
          {onboardedProgress.map((item, index) => (
            <a
              href={item.url}
              key={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ProgressBar
                key={item.name}
                sheetName={item.name}
                progress={item.progress}
                index={index}
              />
            </a>
          ))}
        </div>
      </div>
      {/* Outsourcing Section */}
      <div className="flex-1 border-2 border-gray-300 p-4 rounded">
        <div className="space-y-4">
          {outsourcingProgress.map((item, index) => (
            <a
              href={item.url}
              key={item.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ProgressBar
                key={item.name}
                sheetName={item.name}
                progress={item.progress}
                index={index}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
