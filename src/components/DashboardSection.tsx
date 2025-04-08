"use client";
import ProgressBar from "@/components/ProgressBar";
import CriticalIssuesMeetings from "@/components/CriticalIssuesMeetings";
import { SheetPercentage } from "@/lib/types";
import { PipelineComponent } from "./PipelineComponent";

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
    <div
      className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2"
      style={{ gridTemplateRows: "auto auto" }}
    >
      {/* Critical Issues – should come first */}
      <div className="order-1 lg:col-start-1 lg:row-start-1 flex flex-col justify-between min-h-[300px]">
        <CriticalIssuesMeetings />
      </div>

      {/* Pipeline – should be below Critical Issues on mobile */}
      <div
        className="order-2 bg-white border-2 border-gray-300 shadow-md p-4 rounded 
                lg:col-start-1 lg:row-start-2 flex flex-col justify-between min-h-[300px]"
      >
        <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
        <div className="space-y-4 flex-grow">
          <PipelineComponent pipelineData={pipelineProgress} />
        </div>
      </div>

      {/* Onboarded – comes third on mobile */}
      <div
        className="order-3 bg-white border-2 border-gray-300 shadow-md p-4 rounded 
                      lg:col-start-2 lg:row-span-2 flex flex-col justify-between min-h-[300px]"
      >
        <h2 className="text-2xl font-bold mb-4">OnBoarded ERP Tracker</h2>
        <div className="space-y-4 flex-grow">
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

      {/* Outsourcing – comes fourth on mobile */}
      <div
        className="order-4 bg-white border-2 border-gray-300 shadow-md p-4 rounded 
                      lg:col-start-3 lg:row-span-2 flex flex-col justify-between min-h-[300px]"
      >
        <h2 className="text-2xl font-bold mb-4">
          Outsourcing Contracts Tracker
        </h2>
        <div className="space-y-4 flex-grow">
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
  );
}
