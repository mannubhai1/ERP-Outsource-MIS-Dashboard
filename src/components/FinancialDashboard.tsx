"use client";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { numberWithCommas } from "@/lib/numberWIthCommas";
import {
  fetchFinancialDashboardData,
  FinancialData,
} from "@/lib/financialDashboardData";

const FinancialDashboard: React.FC = () => {
  const [onboardedData, setOnboardedData] = useState<FinancialData[]>([]);
  const [outsourcingData, setOutsourcingData] = useState<FinancialData[]>([]);

  // Your Google Sheets published CSV URL (same for both onboarded and outsourcing)
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_FINANCIAL_CSV_ID}/pub?output=csv`;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_FINANCIAL_LIVE_ID}/edit?gid=0#gid=0`;

  useEffect(() => {
    async function fetchData() {
      try {
        const { onboarded, outsourcing } = await fetchFinancialDashboardData(
          csvUrl
        );
        setOnboardedData(onboarded);
        setOutsourcingData(outsourcing);
      } catch (error) {
        console.error("Error fetching financial dashboard data", error);
      }
    }
    fetchData();
  }, [csvUrl]);

  const totalProjectCostOnboarded = Math.round(
    onboardedData.reduce((acc, cur) => acc + cur.ProjectCost, 0)
  );
  const totalInvoiceOnboarded = Math.round(
    onboardedData.reduce((acc, cur) => acc + cur.InvoiceValue, 0)
  );

  const totalProjectCostOutsourcing = Math.round(
    outsourcingData.reduce((acc, cur) => acc + cur.ProjectCost, 0)
  );
  const totalInvoiceOutsourcing = Math.round(
    outsourcingData.reduce((acc, cur) => acc + cur.InvoiceValue, 0)
  );

  const chartConfig: ChartConfig = {
    ProjectCost: {
      label: "Project Cost",
      color: "#2563eb",
    },
    InvoiceValue: {
      label: "Invoice Value",
      color: "#60a5fa",
    },
  };

  // Helper function to format values:
  const formatCost = (value: number): string => {
    if (value === 0) return "0";
    if (value < 10000000) {
      return `${Math.round(value / 100000)} L`;
    }
    return `${numberWithCommas((value / 10000000).toFixed(1))} Cr`;
  };

  return (
    <div className="p-4 max-w-screen">
      <div className="flex flex-row flex-wrap gap-4 justify-around items-center mt-5 md:mt-10">
        {/* Onboarded Chart & Totals */}
        <div className="w-full sm:w-2/5">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Onboarded Total Project Cost:{" "}
              {numberWithCommas(
                (totalProjectCostOnboarded / 10000000).toFixed(1)
              )}{" "}
              Cr and Total Invoice:{" "}
              {(totalInvoiceOnboarded / 10000000).toFixed(1)} Cr
            </p>
          </div>
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
            <ChartContainer
              config={chartConfig}
              className="min-h-[350px] w-full"
            >
              <BarChart data={onboardedData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="Software"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => formatCost(Number(value))}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="ProjectCost" fill="blue" radius={4}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => formatCost(value)}
                  />
                </Bar>
                <Bar dataKey="InvoiceValue" fill="green" radius={4}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => formatCost(value)}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </a>
        </div>
        {/* Outsourcing Chart & Totals */}
        <div className="w-full sm:w-2/5">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Outsourcing Total Project Cost:{" "}
              {(totalProjectCostOutsourcing / 10000000).toFixed(1)} Cr, Total
              Invoice: {(totalInvoiceOutsourcing / 10000000).toFixed(1)} Cr
            </p>
          </div>
          <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
            <ChartContainer
              config={chartConfig}
              className="min-h-[350px] w-full"
            >
              <BarChart data={outsourcingData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="Software"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => formatCost(Number(value))}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="ProjectCost" fill="blue" radius={4}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => formatCost(value)}
                  />
                </Bar>
                <Bar dataKey="InvoiceValue" fill="green" radius={4}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => formatCost(value)}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
