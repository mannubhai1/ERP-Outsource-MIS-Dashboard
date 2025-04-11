"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ERP } from "@/lib/types";
// import Loading from "@/components/Loading";
import Loader from "@/components/LoadingExp";
import Footer from "@/components/Footer";
import BackToHomeButton from "@/components/BackToHome";
import { DATA_REFRESH_INTERVAL } from "@/lib/constants";

export default function ERPDetailPage() {
  const { id } = useParams() as { id: string };
  const [erp, setErp] = useState<ERP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    async function loadData() {
      // setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/api/erps/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch ERP detail");
        }
        const data = await res.json();
        setErp(data);
      } catch (error) {
        console.error("Error fetching ERP data:", error);
        setErp(null);
      } finally {
        setLoading(false);
      }
    }

    // Initial load
    if (id) {
      loadData();
    }

    intervalId = setInterval(() => {
      if (id) {
        loadData();
      }
    }, DATA_REFRESH_INTERVAL);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id]);

  if (loading) {
    // return <Loading />;
    return <Loader />;
  }

  if (!erp) {
    return <div className="p-6">ERP Not Found</div>;
  }

  const hasExtendedDate = erp.extendedDate && erp.extendedDate.length > 0;

  const firstRowData = [
    {
      label: "Target Date",
      value: hasExtendedDate ? erp.extendedDate : erp.targetDate,
    },
    {
      label: "Primary Contacts",
      value: erp.primaryContacts.join(", ").length
        ? erp.primaryContacts.join(", ")
        : "No primary contacts assigned",
    },
    {
      label: "Business Users",
      value: erp.businessUsers.join(", ").length
        ? erp.businessUsers.join(", ")
        : "No business users assigned",
    },
  ];

  // const secondRowData = [
  //   {
  //     label: "Current Status",
  //     value: erp.currentStatus,
  //     style: "bg-blue-200",
  //   },
  //   { label: "Next Steps", value: erp.nextSteps, style: "bg-yellow-200" },
  //   {
  //     label: "Support Required",
  //     value: erp.Support.length == 0 ? ["None"] : erp.Support,
  //     style: "bg-green-300",
  //   },
  //   {
  //     label: "Issues",
  //     value: erp.Issues.length == 0 ? ["None"] : erp.Issues,
  //     style: "bg-red-300",
  //   },
  // ];

  const companyDocs = [
    { label: "NDA", value: erp.NDA },
    { label: "Agreement", value: erp.Agreement },
    { label: "Techno Commercial Offer", value: erp.Commercial },
    { label: "Brochures", value: erp.Brochures },
    { label: "MOMs", value: erp.MOMs },
    { label: "Implementation Plan", value: erp.implementationPlan },
  ];

  let companyDocsLength = 0;
  companyDocs.forEach((doc) => {
    if (doc.value.length > 0) {
      companyDocsLength++;
    }
  });

  const rmlItems = [
    { label: "Reports", value: erp.Reports },
    { label: "Milestones", value: erp.Milestones },
    { label: "Comparative", value: erp.Comparative },
    { label: "Miscellaneous", value: erp.Miscellaneous },
    { label: "Correspondence", value: erp.Correspondence },
  ];

  const filteredRmlItems = rmlItems.filter((item) => item.value.trim() !== "");

  let rmlGridClass = "";
  if (filteredRmlItems.length === 1) {
    rmlGridClass = "grid grid-cols-1 justify-items-center";
  } else if (filteredRmlItems.length <= 3) {
    rmlGridClass = "grid grid-cols-1 gap-2 justify-items-center";
  } else {
    // For items >3, you might want a single column or adjust as needed
    rmlGridClass = "grid grid-cols-2 gap-2 justify-items-center";
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-6 text-black bg-gray-100">
        <div className="mb-15">
          <div className="flex flex-col mb-6 space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="w-full text-2xl font-bold text-center sm:text-left md:text-3xl">
              {erp.name.toUpperCase()}
            </h1>
            <div className="flex flex-col w-full space-y-3 sm:w-auto sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
              <div className="flex items-center justify-center w-full text-lg text-gray-600 sm:justify-start">
                <span className="mr-2 font-medium">Last Updated:</span>
                <span
                  className={`px-2 py-1 rounded ${
                    erp?.lastUpdated === ""
                      ? "bg-gray-200 text-gray-500 italic"
                      : "bg-gray-100"
                  }`}
                >
                  {erp?.lastUpdated || "Not available"}
                </span>
              </div>
              <BackToHomeButton />
            </div>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {firstRowData.map((item, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg bg-white shadow-md"
              >
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Column 1: Current Status */}
            <div className="p-4 border rounded-lg bg-blue-100 shadow-md">
              <strong className="text-md md:text-lg lg:text-xl">
                Current Status:
              </strong>
              <ul className="list-disc pl-5 mt-2">
                {erp.currentStatus.map((val: string, index: number) => (
                  <li key={index} className="text-black">
                    {val}
                  </li>
                ))}
              </ul>
            </div>
            {/* Column 2: Next Steps */}
            <div className="p-4 border rounded-lg bg-yellow-100 shadow-md">
              <strong className="text-md md:text-lg lg:text-xl">
                Next Steps:
              </strong>
              <ul className="list-disc pl-5 mt-2">
                {erp.nextSteps.map((val: string, index: number) => (
                  <li key={index} className="text-black">
                    {val}
                  </li>
                ))}
              </ul>
            </div>
            {/* Column 3: Combined Support & Issues */}
            <div className="flex flex-col gap-4">
              <div className="p-4 border rounded-lg bg-green-100 shadow-md">
                <strong className="text-md md:text-lg lg:text-xl">
                  Support Required:
                </strong>
                <ul className="list-disc pl-5 mt-2">
                  {(erp.Support.length === 0 ? ["None"] : erp.Support).map(
                    (val: string, index: number) => (
                      <li key={index} className="text-black">
                        {val}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-red-100 shadow-md">
                <strong className="text-md md:text-lg lg:text-xl">
                  Issues:
                </strong>
                <ul className="list-disc pl-5 mt-2">
                  {(erp.Issues.length === 0 ? ["None"] : erp.Issues).map(
                    (val: string, index: number) => (
                      <li key={index} className="text-black">
                        {val}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Companies Row */}
          <h2 className="text-2xl font-semibold mb-4">
            VENDORS / PARTNERS / CONTRACTORS DATA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-4">
            {erp.companies && erp.companies.length > 0 ? (
              erp.companies.map((company, idx) => (
                <div
                  key={idx}
                  className="relative group w-full h-50 overflow-hidden"
                >
                  <div className="flip-card relative w-full h-full">
                    <div className="flip-card-inner w-full h-full">
                      <div className="front flex justify-center items-center bg-white border shadow-lg rounded-lg">
                        <p className="text-md md:text-lg lg:text-xl text-center font-semibold">
                          {company.toUpperCase()}
                        </p>
                      </div>
                      <div className="back w-full h-full bg-gray-800 text-white borderflex flex-col justify-center items-center rounded-lg p-2 sm:p-4 overflow-y-auto transform rotateY-180">
                        {/* Render the company documents dynamically */}
                        <div
                          className={`${
                            companyDocsLength === 1
                              ? "grid grid-cols-1 gap-2 justify-items-center pointer-events-auto"
                              : "grid grid-cols-2 gap-2 gap-x-4 justify-center lg:justify-items-center pointer-events-auto"
                          } w-full`}
                        >
                          {companyDocs.map((doc, index) => {
                            const value = doc.value[idx];
                            if (value === "NA") return null;
                            return (
                              value && (
                                <a
                                  key={index}
                                  href={value}
                                  target="_blank"
                                  className="docs mb-2 text-xs sm:text-base text-yellow-300 hover:text-white break-words"
                                >
                                  {doc.label}
                                </a>
                              )
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No companies available for this ERP.</div>
            )}
          </div>

          {/* RML DATA Section */}
          {filteredRmlItems.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">RML DATA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                <div className="relative group w-full h-50 overflow-hidden">
                  <div className="flip-card relative w-full h-full">
                    <div className="flip-card-inner w-full h-full">
                      <div className="front flex justify-center items-center bg-white border shadow-lg rounded-lg">
                        <p className="text-md md:text-lg lg:text-xl text-center font-semibold">
                          RML DATA
                        </p>
                      </div>
                      <div className="back flex flex-col justify-center items-center bg-gray-800 border rounded-lg p-2 sm:p-4 overflow-y-auto">
                        <div
                          className={`${rmlGridClass} w-full pointer-events-auto`}
                        >
                          {filteredRmlItems.map((item, index) => (
                            <a
                              key={index}
                              href={item.value}
                              target="_blank"
                              className="docs mb-2 text-xs sm:text-base text-yellow-300 hover:text-white break-words"
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
