"use client";
import { useEffect, useState } from "react";
import ERPCard from "@/components/ERPCard";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import DashboardSection from "@/components/DashboardSection";
import {
  calculatePercentages,
  SheetPercentage,
} from "@/lib/calculatePercentages";
import { ERP } from "@/lib/types";
import { DATA_REFRESH_INTERVAL } from "@/lib/constants";
import pipelineData from "@/data/pipeline.json";
import onboardedData from "@/data/onboarded.json";
import outsourcingData from "@/data/outsourcing.json";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<string>("");
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
    const lastVisitedTab = localStorage.getItem("selectedTab");
    if (lastVisitedTab) {
      setSelectedTab(lastVisitedTab);
    }
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

  // Filter ERPs based on selected tab
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

  const handleTabChange = (currentTab: string) => {
    if (currentTab === selectedTab) {
      setSelectedTab("");
    } else {
      setSelectedTab(currentTab);
    }
    localStorage.setItem("selectedTab", currentTab);
  };

  if (loading) {
    return <Loading />;
  }

  // Statuses for tabs
  const statuses = [
    { label: "ERP IN PIPELINE", key: "pipeline", color: "bg-slate-500" },
    { label: "ERP ONBOARDED", key: "onboarded", color: "bg-slate-500" },
    {
      label: "OUTSOURCING CONTRACT",
      key: "outsourcing",
      color: "bg-slate-500",
    },
  ];

  return (
    <div className="p-4 min-h-screen bg-[#f8f9fa] text-[#212529]">
      <div className="mb-15">
        <h1
          className="text-2xl md:text-4xl font-bold mb-5 text-black cursor-pointer"
          onClick={() => handleTabChange("")}
        >
          ERP / OUTSOURCING DASHBOARD
        </h1>
        {/* View Dashboard Button: shown only when a tab is selected */}
        {selectedTab !== "" && (
          <button
            className="bg-blue-400 text-white font-bold p-2 rounded mb-4 w-full sm:w-auto text-md md:text-xl hover:bg-blue-300"
            onClick={() => handleTabChange("")}
          >
            View Live Dashboard status
          </button>
        )}
        {selectedTab === "" && (
          <button
            className="bg-blue-400 text-white font-bold p-2 rounded mb-4 w-full sm:w-auto text-md md:text-xl hover:bg-blue-300"
            onClick={() => handleTabChange("pipeline")}
          >
            View ERPs/Contracts
          </button>
        )}
        {/* Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statuses.map((status) => (
            <button
              key={status.key}
              className={`text-lg md:text-2xl font-bold rounded p-2 hover:bg-blue-300 ${
                selectedTab === ""
                  ? "bg-gray-200 text-black"
                  : selectedTab === status.key
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleTabChange(status.key)}
            >
              {status.label}
            </button>
          ))}
        </div>
        {/* Dashboard Section or ERP Cards */}
        {selectedTab === "" ? (
          <DashboardSection
            pipelineProgress={pipelineProgress}
            onboardedProgress={onboardedProgress}
            outsourcingProgress={outsourcingProgress}
          />
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
