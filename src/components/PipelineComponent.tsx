"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { SheetPercentage } from "@/lib/types";

export interface PipelineComponentProps {
  pipelineData: SheetPercentage[];
}

export function PipelineComponent({ pipelineData }: PipelineComponentProps) {
  // Define an array of colors
  const colors = [
    "#2563eb", // blue
    "#60a5fa", // light blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
  ];

  // Map pipelineData to include a unique color for each bar.
  const chartData = pipelineData.map((item, index) => ({
    name: item.name,
    progress: Math.round(item.progress),
    url: item.url,
    color: colors[index % colors.length],
  }));

  // Chart config – here we use the key 'progress'
  const chartConfig: ChartConfig = {
    progress: {
      label: "Progress",
      color: chartData.length > 0 ? chartData[0].color : "hsl(var(--chart-1))",
    },
  };

  // When a bar is clicked, open the URL
  const handleBarClick = (data: { url?: string } | null) => {
    if (data && data.url) {
      window.open(data.url, "_blank");
    }
  };

  return (
    <Card>
      <CardContent className="flex-1 pb-0">
        <a href={chartData[0]?.url} target="_blank" rel="noopener noreferrer ">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
          >
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="progress" radius={8} onClick={handleBarClick}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `${Math.round(value)}%`}
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </a>
      </CardContent>
    </Card>
  );
}
