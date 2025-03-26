"use client";
import { useEffect, useState } from "react";
import ERPCard from "@/components/ERPCard";
import Footer from "@/components/Footer";
import { ERP } from "@/lib/types";

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/api/erps`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("pipeline");
  const [erps, setErps] = useState<ERP[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const erpData = await getData();
        setErps(erpData);
      } catch (error) {
        console.error("Error fetching ERP data:", error);
      }
    };
    loadData();
  }, []);

  const filterData = (status: string) => {
    if (status === "pipeline") {
      return erps.filter((erp) => erp.status === "In Pipeline");
    } else if (status === "onboarded") {
      return erps.filter((erp) => erp.status === "Onboarded");
    } else if (status === "outsourcing") {
      return erps.filter((erp) => erp.status === "Outsourcing Contract");
    }
    return erps;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mb-15">
        <h1 className="text-2xl md:text-4xl font-bold text-black mb-6">
          ERP / OUTSOURCING DASHBOARD
        </h1>

        {/* Responsive Tabs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "pipeline"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTab("pipeline")}
          >
            ERP IN PIPELINE
          </button>

          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "onboarded"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTab("onboarded")}
          >
            ERP ONBOARDED
          </button>

          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "outsourcing"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setSelectedTab("outsourcing")}
          >
            OUTSOURCING CONTRACT
          </button>
        </div>

        {/* ERP Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterData(selectedTab).map((erp) => (
            <ERPCard key={erp.id} erp={erp} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
