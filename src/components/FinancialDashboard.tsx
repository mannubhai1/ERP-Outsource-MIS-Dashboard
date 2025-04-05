"use client";
import { useEffect, useState } from "react";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
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
      } finally {
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

  const chartConfig = {
    ProjectCost: {
      label: "Project Cost",
      color: "#2563eb",
    },
    InvoiceValue: {
      label: "Invoice Value",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2> */}
      <div className="flex flex-col lg:flex-row gap-x-20 justify-between items-center mt-5 md:mt-10">
        {/* Onboarded Chart & Totals */}
        <div className="w-full sm:w-3/4">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Total Project Cost:{" "}
              {numberWithCommas(
                (totalProjectCostOnboarded / 10000000).toFixed(0)
              )}{" "}
              Cr and Total Invoice:{" "}
              {(totalInvoiceOnboarded / 10000000).toFixed(0)} Cr
            </p>
          </div>
          <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <BarChart data={onboardedData}>
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
                tickFormatter={(value) => {
                  return `${Math.round(value) / 10000000} Cr`;
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ProjectCost" fill="blue" radius={4}>
                {" "}
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => {
                    if (value === 0) {
                      return "0";
                    } else if (value < 10000000) {
                      return `${(Math.round(value) / 100000).toFixed(0)} L`;
                    } else {
                      return `${numberWithCommas(
                        (Math.round(value) / 10000000).toFixed(0)
                      )} Cr`;
                    }
                  }}
                />
              </Bar>
              <Bar dataKey="InvoiceValue" fill="green" radius={4}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => {
                    if (value === 0) {
                      return "0";
                    } else if (value < 10000000) {
                      return `${(Math.round(value) / 100000).toFixed(0)} L`;
                    } else {
                      return `${numberWithCommas(
                        (Math.round(value) / 10000000).toFixed(0)
                      )} Cr`;
                    }
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        {/* Outsourcing Chart & Totals */}
        <div className="w-full sm:w-3/4">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Total Project Cost:{" "}
              {(totalProjectCostOutsourcing / 10000000).toFixed(0)} Cr and Total
              Invoice: {(totalInvoiceOutsourcing / 10000000).toFixed(0)} Cr
            </p>
          </div>
          <ChartContainer
            config={chartConfig}
            className="min-h-[350px] w-full "
          >
            <BarChart data={outsourcingData}>
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
                tickFormatter={(value) => {
                  return `${Math.round(value) / 10000000} Cr`;
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="ProjectCost" fill="blue" radius={4}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => {
                    if (value === 0) {
                      return "0";
                    } else if (value < 10000000) {
                      return `${(Math.round(value) / 100000).toFixed(0)} L`;
                    } else {
                      return `${numberWithCommas(
                        (Math.round(value) / 10000000).toFixed(0)
                      )} Cr`;
                    }
                  }}
                />
              </Bar>
              <Bar dataKey="InvoiceValue" fill="green" radius={4}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => {
                    if (value === 0) {
                      return "0";
                    } else if (value < 10000000) {
                      return `${(Math.round(value) / 100000).toFixed(0)} L`;
                    } else {
                      return `${numberWithCommas(
                        (Math.round(value) / 10000000).toFixed(0)
                      )} Cr`;
                    }
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
