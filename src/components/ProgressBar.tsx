"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

interface TickRow {
  Tick?: string; // Adjust to your column name
}

interface ProgressBarProps {
  sheetName: string;
  csvUrl: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ sheetName, csvUrl }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch and parse the CSV data
  useEffect(() => {
    async function fetchAndParseCsv() {
      setLoading(true);

      try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV. Status: ${response.status}`);
        }
        const csvData = await response.text();

        // Parsing CSV using Papaparse
        const parsedResult = Papa.parse<TickRow>(csvData, {
          header: true, // Treat first row as header row
          skipEmptyLines: true,
        });

        if (parsedResult.errors.length) {
          console.error("Papaparse errors:", parsedResult.errors);
          throw new Error("Error parsing CSV data");
        }

        // Count how many rows have "true" or "✔" in the "Tick" column
        let trueCount = 0;
        let totalCount = 0;
        (parsedResult.data || []).forEach((row) => {
          if (row.Tick !== "") {
            // Skip empty rows
            const tickValue = row.Tick?.toLowerCase?.();
            if (tickValue === "true") {
              trueCount++;
              totalCount++;
            } else if (tickValue === "false") {
              totalCount++;
            }
          }
        });

        console.log(
          `Sheet: ${sheetName}, Total: ${totalCount}, True: ${trueCount}`
        );

        // Calculate progress percentage
        const progressPercentage =
          totalCount === 0 ? 0 : (trueCount / totalCount) * 100;
        // setProgress(progressPercentage);
        setProgress(80);
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAndParseCsv();
  }, [csvUrl, sheetName]);

  // Determine the color based on the progress percentage
  const getBarColor = (progress: number) => {
    if (progress <= 20) return "#F87171"; // Red
    if (progress <= 40) return "#F59E0B"; // Orange
    if (progress <= 60) return "#FBBF24"; // Yellow
    if (progress <= 80) return "#4ADE80"; // Green
    return "#3B82F6"; // Blue
  };

  if (loading) {
    return <p>Loading {sheetName} data...</p>;
  }

  return (
    <div className="flex items-center space-x-4 mb-6">
      {/* Sheet name on the left */}
      <h3 className="text-lg font-semibold text-gray-700">{sheetName}</h3>

      {/* Progress bar on the right */}
      <div className="relative w-full max-w-md h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* The progress bar itself */}
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: getBarColor(progress), // Solid color based on progress
          }}
        >
          {/* Percentage text inside the bar */}
          <div className="absolute inset-0 flex justify-center items-center text-black font-bold text-sm">
            {progress.toFixed(1)}%
          </div>
        </div>

        {/* Lines for percentage markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {[20, 40, 60, 80].map((percent) => (
            <div
              key={percent}
              className="w-px h-4 bg-gray-500"
              style={{ left: `${percent}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
