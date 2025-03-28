"use client";
import { useEffect, useState } from "react";
// import { CheckCircle } from "lucide-react"; // You can choose any icon you like from Lucide
import Papa from "papaparse";

interface TickRow {
  Tick?: string; // Adjust to your column name
}

interface ProgressBarProps {
  sheetName: string;
  csvUrl: string;
}

// Color mapping for different sheets
const sheetColorMap: Record<string, string> = {
  Rego: "bg-blue-500",
  SGS: "bg-green-500",
  Sodexo: "bg-red-500",
  Safety_Outsourcing: "bg-yellow-500",
};

const ProgressBar: React.FC<ProgressBarProps> = ({ sheetName, csvUrl }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndParseCsv() {
      setLoading(true);

      try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV. Status: ${response.status}`);
        }
        const csvData = await response.text();

        const parsedResult = Papa.parse<TickRow>(csvData, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsedResult.errors.length) {
          console.error("Papaparse errors:", parsedResult.errors);
          throw new Error("Error parsing CSV data");
        }

        let trueCount = 0;
        let totalCount = 0;
        (parsedResult.data || []).forEach((row) => {
          if (row.Tick !== "") {
            const tickValue = row.Tick?.toLowerCase?.();
            if (tickValue === "true") {
              trueCount++;
              totalCount++;
            } else if (tickValue === "false") {
              totalCount++;
            }
          }
        });

        // console.log(
        //   `Sheet: ${sheetName}, Total: ${totalCount}, True: ${trueCount}`
        // );

        const progressPercentage =
          totalCount === 0 ? 0 : (trueCount / totalCount) * 100;
        animateProgress(progressPercentage);
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndParseCsv();
  }, [csvUrl, sheetName]);

  const animateProgress = (targetProgress: number) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress <= targetProgress) {
        setProgress(currentProgress);
        currentProgress++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  // Get the color for the current sheet, default to gray if not found in the map
  const progressBarColor = sheetColorMap[sheetName] || "bg-gray-500";

  if (loading) {
    return <p>Loading {sheetName} data...</p>;
  }

  return (
    <div className="flex items-center space-x-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 w-full sm:w-1/4 md:w-1/8">
        {sheetName}
      </h3>
      <div className="relative w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-8 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-400">
        <div
          className={`h-full ${progressBarColor} transition-all ease-in-out duration-200`}
          style={{ width: `${progress}%` }}
        ></div>
        {/* Lucide icon at the percentage stop */}
        {/* {progress > 0 && progress < 100 && (
          <div
            className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${progress}%` }}
          >
            <CheckCircle className="text-black w-6 h-6" />
          </div>
        )} */}
        <div className="absolute inset-0 flex justify-center items-center text-black font-bold text-sm">
          {progress.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
