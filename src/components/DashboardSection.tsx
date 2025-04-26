"use client";

import CriticalIssuesMeetings from "@/components/CriticalIssuesMeetings";
import { SheetPercentage, ModuleData } from "@/lib/types";
import { PipelineComponent } from "./PipelineComponent";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/newCard";
import { Progress } from "@/components/ui/progress";

interface DashboardSectionProps {
  pipelineProgress: SheetPercentage[];
  onboardedProgress: ModuleData[];
  outsourcingProgress: ModuleData[];
}

const getStatusColor = (status: ModuleData["status"]): string => {
  switch (status) {
    case "not started":
      return "bg-gray-500";
    case "Low":
      return "bg-red-700";
    case "Medium":
      return "bg-orange-400";
    case "Fair":
      return "bg-yellow-500";
    case "Good":
      return "bg-green-500";
    case "Excellent":
      return "bg-green-700";
    default:
      return "bg-blue-500";
  }
};

const getStatusBadgeColor = (status: ModuleData["status"]): string => {
  switch (status) {
    case "not started":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case "Low":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "Fair":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Good":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Excellent":
      return "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
};

export default function DashboardSection({
  pipelineProgress,
  onboardedProgress,
  outsourcingProgress,
}: DashboardSectionProps) {
  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Meetings */}
      <section>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          Critical Issues & Meetings
        </h1>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <CriticalIssuesMeetings />
        </div>
      </section>

      {/* OnBoarded ERP Tracker */}
      <section>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          OnBoarded ERP Tracker
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {onboardedProgress.map((item) => (
            <Card
              key={item.id}
              className="relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* 1) The expanding circle */}
              <div
                aria-hidden="true"
                className={`
                  absolute -top-[75px] -right-[75px]
                  w-[128px] h-[128px] rounded-full
                  ${getStatusColor(item.status)}
                  transition-transform duration-500
                  group-hover:scale-[10]
                  z-0
                `}
              />

              {/* 2) All real content lives above it */}
              <div className="relative z-10 px-4 py-5 space-y-3">
                {/* Header */}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="
                        text-lg font-medium text-gray-900 
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      {item.name}
                    </CardTitle>
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getStatusBadgeColor(item.status)}
                        transition-colors duration-300
                        group-hover:bg-white
                        group-hover:text-gray-900
                      `}
                    >
                      {item.status}
                    </span>
                  </div>
                </CardHeader>

                {/* Body */}
                <CardContent>
                  <div className="space-y-2">
                    <div
                      className="
                        flex justify-between text-sm text-gray-600
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      <span>Progress</span>
                      <span className="font-medium">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2 rounded" />
                    <div
                      className="
                        flex justify-between text-sm text-gray-500
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      <span>
                        Modules: {item.tasksCompleted}/{item.tasks}
                      </span>
                      <a
                        href={item.url}
                        className="
                        text-blue-600 hover:underline
                          transition-colors duration-300
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Outsourcing Contracts Tracker */}
      <section>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          Outsourcing Contracts Tracker
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {outsourcingProgress.map((item) => (
            <Card
              key={item.id}
              className="relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* 1) The expanding circle */}
              <div
                aria-hidden="true"
                className={`
                  absolute -top-[75px] -right-[75px]
                  w-[128px] h-[128px] rounded-full
                  ${getStatusColor(item.status)}
                  transition-transform duration-500
                  group-hover:scale-[10]
                  z-0
                `}
              />

              {/* 2) All real content lives above it */}
              <div className="relative z-10 px-4 py-5 space-y-3">
                {/* Header */}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="
                        text-lg font-medium text-gray-900 
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      {item.name}
                    </CardTitle>
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getStatusBadgeColor(item.status)}
                        transition-colors duration-300
                        group-hover:bg-white
                        group-hover:text-gray-900
                      `}
                    >
                      {item.status}
                    </span>
                  </div>
                </CardHeader>

                {/* Body */}
                <CardContent>
                  <div className="space-y-2">
                    <div
                      className="
                        flex justify-between text-sm text-gray-600
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      <span>Progress</span>
                      <span className="font-medium">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2 rounded" />
                    <div
                      className="
                        flex justify-between text-sm text-gray-500
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      <span>
                        Modules: {item.tasksCompleted}/{item.tasks}
                      </span>
                      <a
                        href={item.url}
                        className="
                        text-blue-600 hover:underline
                          transition-colors duration-300
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Pipeline</h1>
        <div>
          <PipelineComponent pipelineData={pipelineProgress} />
        </div>
      </section>
    </div>
  );
}
