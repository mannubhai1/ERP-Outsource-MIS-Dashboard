"use client";
import React from "react";
// import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { SheetPercentage } from "@/lib/types";

export function PipelineComponent({
  pipelineData,
}: {
  pipelineData: SheetPercentage[];
}) {
  const chartData = pipelineData.map((item) => ({
    name: item.name,
    visitors: item.progress,
    url: item.url,
  }));

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Progress",
    },
  };

  // When a bar is clicked, open the URL from the payload.
  const handleBarClick = (data: { url?: string } | null) => {
    if (data && data.url) {
      window.open(data.url, "_blank");
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pipeline Progress</CardTitle>
        <CardDescription>Current Pipeline Progress</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <RadialBar dataKey="visitors" background onClick={handleBarClick}>
              <LabelList
                position="insideStart"
                dataKey="name"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Click on a bar for more details.
        </div>
      </CardFooter> */}
    </Card>
  );
}
