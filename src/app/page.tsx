"use client";
import { useEffect, useState } from "react";

import ERPCard from "@/components/ERPCard";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import DashboardSection from "@/components/DashboardSection";
import FinancialDashboard from "@/components/FinancialDashboard";

import { calculatePercentages } from "@/lib/calculatePercentages";
import { ERP, SheetPercentage } from "@/lib/types";
import { DATA_REFRESH_INTERVAL } from "@/lib/constants";

import pipelineData from "@/data/pipeline.json";
import onboardedData from "@/data/onboarded.json";
import outsourcingData from "@/data/outsourcing.json";

export default function Home() {
  // Default to "dashboard" if localStorage is not set.
  const [selectedTab, setSelectedTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTab") || "dashboard";
    }
    return "dashboard";
  });
  const [erps, setErps] = useState<ERP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Progress states for each section
  const [pipelineProgress, setPipelineProgress] = useState<SheetPercentage[]>(
    []
  );
  const [onboardedProgress, setOnboardedProgress] = useState<SheetPercentage[]>(
    []
  );
  const [outsourcingProgress, setOutsourcingProgress] = useState<
    SheetPercentage[]
  >([]);

  // Fetch ERP data
  useEffect(() => {
    async function loadERPData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/api/erps`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch ERP Data");
        const data = await res.json();
        setErps(data);
      } catch (error) {
        console.error("Error fetching ERP data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadERPData();
    const interval = setInterval(loadERPData, DATA_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Fetch Pipeline progress (using pipeline mode)
  useEffect(() => {
    async function loadPipelineProgress() {
      const finalPipelineData = pipelineData.map((sheet) => ({
        ...sheet,
        csvUrl: sheet.csvUrl.replace(
          "YOUR_PIPELINE_CSV_ID",
          process.env.NEXT_PUBLIC_PIPELINE_CSV_ID || ""
        ),
        url: sheet.url.replace(
          "YOUR_PIPELINE_LIVE_ID",
          process.env.NEXT_PUBLIC_PIPELINE_LIVE_ID || ""
        ),
      }));
      try {
        const results = await calculatePercentages(
          finalPipelineData,
          "pipeline"
        );
        // console.log("Pipeline Progress Results:", results);
        setPipelineProgress(results as SheetPercentage[]);
      } catch (error) {
        console.error("Error calculating pipeline percentages", error);
      }
    }
    loadPipelineProgress();
  }, []);

  // Fetch Onboarded progress (using normal mode)
  useEffect(() => {
    async function loadOnboardedProgress() {
      const finalOnboardedData = onboardedData.map((sheet) => ({
        ...sheet,
        csvUrl: sheet.csvUrl.replace(
          "YOUR_NORMAL_CSV_ID",
          process.env.NEXT_PUBLIC_NORMAL_CSV_ID || ""
        ),
        url: sheet.url.replace(
          "YOUR_NORMAL_LIVE_ID",
          process.env.NEXT_PUBLIC_NORMAL_LIVE_ID || ""
        ),
      }));
      try {
        const results = await calculatePercentages(
          finalOnboardedData,
          "normal"
        );
        setOnboardedProgress(results as SheetPercentage[]);
      } catch (error) {
        console.error("Error calculating onboarded percentages", error);
      }
    }
    loadOnboardedProgress();
  }, []);

  // Fetch Outsourcing progress (using normal mode)
  useEffect(() => {
    const finalOutsourcingData = outsourcingData.map((sheet) => ({
      ...sheet,
      csvUrl: sheet.csvUrl.replace(
        "YOUR_NORMAL_CSV_ID",
        process.env.NEXT_PUBLIC_NORMAL_CSV_ID || ""
      ),
      url: sheet.url.replace(
        "YOUR_NORMAL_LIVE_ID",
        process.env.NEXT_PUBLIC_NORMAL_LIVE_ID || ""
      ),
    }));
    async function loadOutsourcingProgress() {
      try {
        const results = await calculatePercentages(
          finalOutsourcingData,
          "normal"
        );
        setOutsourcingProgress(results as SheetPercentage[]);
      } catch (error) {
        console.error("Error calculating outsourcing percentages", error);
      }
    }
    loadOutsourcingProgress();
  }, []);

  // Filter ERPs based on selected tab (for ERP cards view)
  const filterData = (status: string) => {
    if (status === "pipeline") {
      return erps.filter((erp) => erp.status === "In Pipeline");
    } else if (status === "onboarded") {
      return erps.filter((erp) => erp.status === "Onboarded");
    } else if (status === "outsourcing") {
      return erps.filter((erp) => erp.status === "Outsourcing Contract");
    }
    return [];
  };

  const handleTabChange = (newTab: string) => {
    setSelectedTab(newTab);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedTab", newTab);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Define statuses for ERP cards view.
  const statusesForERP = [
    { label: "ERP IN PIPELINE", key: "pipeline", color: "bg-slate-500" },
    { label: "ERP ONBOARDED", key: "onboarded", color: "bg-slate-500" },
    {
      label: "OUTSOURCING CONTRACT",
      key: "outsourcing",
      color: "bg-slate-500",
    },
  ];

  // Helper: Render Button Group
  const renderButtonGroup = () => {
    if (selectedTab === "dashboard" || selectedTab === "financial") {
      return (
        <div className="flex gap-4 mb-4">
          <button
            className="bg-blue-400 text-white font-bold p-2 rounded w-full sm:w-auto text-md md:text-xl hover:bg-blue-500"
            onClick={() => handleTabChange("pipeline")}
          >
            View ERPs/Contracts
          </button>
          <button
            className="bg-green-400 text-white font-bold p-2 rounded w-full sm:w-auto text-md md:text-xl hover:bg-green-500"
            onClick={() =>
              handleTabChange(
                selectedTab === "dashboard" ? "financial" : "dashboard"
              )
            }
          >
            {selectedTab === "dashboard"
              ? "View Financial Status"
              : "View Live Dashboard status"}
          </button>
        </div>
      );
    } else {
      // In ERP cards view: allow switching directly to dashboard or financial.
      return (
        <div className="flex gap-4 mb-4">
          <button
            className="bg-blue-400 text-white font-bold p-2 rounded w-full sm:w-auto text-md md:text-xl hover:bg-blue-500"
            onClick={() => handleTabChange("dashboard")}
          >
            View Live Dashboard status
          </button>
          <button
            className="bg-green-400 text-white font-bold p-2 rounded w-full sm:w-auto text-md md:text-xl hover:bg-green-500"
            onClick={() => handleTabChange("financial")}
          >
            View Financial Status
          </button>
        </div>
      );
    }
  };

  // Helper: Render Heading Tabs
  const renderHeadingTabs = () => {
    if (selectedTab === "dashboard") {
      // In dashboard mode, show all three statuses as disabled.
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statusesForERP.map((status) => (
            <button
              key={status.key}
              disabled
              className="text-lg md:text-2xl font-bold rounded p-2 bg-gray-200 text-black"
            >
              {status.label}
            </button>
          ))}
        </div>
      );
    } else if (selectedTab === "financial") {
      // In financial mode, show only onboarded and outsourcing (filter out pipeline).
      const financialTabs = statusesForERP.filter((s) => s.key !== "pipeline");
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {financialTabs.map((status) => (
            <button
              key={status.key}
              disabled
              className="text-lg md:text-2xl font-bold rounded p-2 bg-gray-200 text-black"
            >
              {status.label}
            </button>
          ))}
        </div>
      );
    } else {
      // Otherwise (in ERP cards view) show clickable tabs.
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statusesForERP.map((status) => (
            <button
              key={status.key}
              className={`text-lg md:text-2xl font-bold rounded p-2 hover:bg-blue-300 ${
                selectedTab === status.key
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleTabChange(status.key)}
            >
              {status.label}
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="p-4 min-h-screen bg-[#f8f9fa] text-[#212529]">
      <div className="mb-15">
        <h1
          className="text-2xl md:text-4xl font-bold mb-5 text-black cursor-pointer"
          // Toggle between "dashboard" and ERP cards view when clicking the title
          onClick={() => {
            if (selectedTab === "dashboard") {
              handleTabChange("pipeline");
            } else {
              handleTabChange("dashboard");
            }
          }}
        >
          ERP / OUTSOURCING DASHBOARD
        </h1>
        {/* Render Button Group */}
        {renderButtonGroup()}

        {/* Render Heading Tabs if in dashboard/financial or ERP cards view */}
        {(selectedTab === "dashboard" ||
          selectedTab === "financial" ||
          (selectedTab !== "dashboard" && selectedTab !== "financial")) &&
          renderHeadingTabs()}

        {/* Content Rendering */}
        {selectedTab === "dashboard" ? (
          <DashboardSection
            pipelineProgress={pipelineProgress}
            onboardedProgress={onboardedProgress}
            outsourcingProgress={outsourcingProgress}
          />
        ) : selectedTab === "financial" ? (
          <FinancialDashboard />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            {filterData(selectedTab).map((erp) => (
              <ERPCard key={erp.id} erp={erp} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
