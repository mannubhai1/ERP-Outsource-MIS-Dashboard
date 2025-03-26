"use client";
import { useEffect, useState } from "react";
import ERPCard from "@/components/ERPCard";
import Footer from "@/components/Footer";

export interface ERP {
  id: number;
  name: string;
  companies: string[];
  status: string;
  currentStatus: string[];
  nextSteps: string[];
  targetDate: string;
  extendedDate?: string;
  challenges: string[];
  primaryContacts: string[];
  businessUsers: string[];
  NDA: string[];
  Agreement: string[];
  Commercial: string[];
}

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  console.log("baseUrl:", baseUrl);

  const res = await fetch(`${baseUrl}/api/erps`, { cache: "no-store" });
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
    } else {
      return erps;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-black mb-6">
        ERP / OUTSOURCING DASHBOARD
      </h1>

      {/* Tabs Section */}
      <div className="flex justify-between space-x-4 mb-6">
        <button
          className={`text-2xl font-bold flex-1 ${
            selectedTab === "pipeline"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } p-2 rounded`}
          onClick={() => setSelectedTab("pipeline")}
        >
          ERP IN PIPELINE
        </button>
        <button
          className={`text-2xl font-bold flex-1 ${
            selectedTab === "onboarded"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } p-2 rounded`}
          onClick={() => setSelectedTab("onboarded")}
        >
          ERP ONBOARDED
        </button>
        <button
          className={`text-2xl font-bold flex-1 ${
            selectedTab === "outsourcing"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          } p-2 rounded`}
          onClick={() => setSelectedTab("outsourcing")}
        >
          OUTSOURCING CONTRACT
        </button>
      </div>

      {/* ERP Cards based on selected tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterData(selectedTab).map((erp: ERP) => (
          <ERPCard key={erp.id} erp={erp} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
