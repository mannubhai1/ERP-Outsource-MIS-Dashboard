"use client";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
interface ChartData {
  Software: string;
  ProjectCost: number;
  InvoiceValue: number;
}

const FinancialDashboard: React.FC = () => {
  const chartDataOnBoarded: ChartData[] = [
    { Software: "CRM", ProjectCost: 186, InvoiceValue: 80 },
    { Software: "HRMS", ProjectCost: 305, InvoiceValue: 200 },
    { Software: "TMS(Inbound)", ProjectCost: 237, InvoiceValue: 120 },
    { Software: "TMS(Outbound)", ProjectCost: 73, InvoiceValue: 190 },
    { Software: "FDMS", ProjectCost: 209, InvoiceValue: 130 },
  ];
  const chartDataOutsourcing: ChartData[] = [
    { Software: "QMS", ProjectCost: 186, InvoiceValue: 80 },
    { Software: "House Keeping", ProjectCost: 305, InvoiceValue: 200 },
    { Software: "Plant Safety", ProjectCost: 237, InvoiceValue: 120 },
    { Software: "CLMS", ProjectCost: 73, InvoiceValue: 190 },
    { Software: "Transport Management", ProjectCost: 209, InvoiceValue: 130 },
    { Software: "Payroll", ProjectCost: 214, InvoiceValue: 140 },
  ];

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
    <>
      {/* <div className="p-4 bg-white border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Financial Dashboard</h2>
        <p>
          This section will show each ERP&apos;s total amount to be paid and the
          amount paid till now.
        </p>
      </div> */}
      <div className="flex flex-col lg:flex-row gap-x-20 justify-between items-center mt-10 md:mt-20">
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] w-full sm:w-3/4"
        >
          <BarChart accessibilityLayer data={chartDataOnBoarded}>
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
              tickFormatter={(value) => `${value}L`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ProjectCost" fill="blue" radius={4} />
            <Bar dataKey="InvoiceValue" fill="green" radius={4} />
          </BarChart>
        </ChartContainer>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] w-full sm:w-3/4"
        >
          <BarChart accessibilityLayer data={chartDataOutsourcing}>
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
              tickFormatter={(value) => `${value}L`}
            />

            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ProjectCost" fill="blue" radius={4} />
            <Bar dataKey="InvoiceValue" fill="green" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  );
};

export default FinancialDashboard;
