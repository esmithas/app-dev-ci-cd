import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"



interface ChartRadialStackedProps {
  completedTasks: number;
  pendingTasks: number;
}

export function ChartRadialStacked({ completedTasks, pendingTasks }: ChartRadialStackedProps) {
  const now = new Date();
  const currentMonth = now.toLocaleString('en-US', { month: 'long' });
  const currentYear = now.getFullYear();

  const chartData = [{ month: currentMonth, completed: completedTasks, pending: pendingTasks }]


  const chartConfig = {
    completed: {
      label: "Completed",
      color: "var(--chart-2)",
    },
    pending: {
      label: "Pending",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig
  const totalVisitors = completedTasks + pendingTasks


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Stacked</CardTitle>
        <CardDescription>{currentMonth} {currentYear}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()} Taks
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {`${pendingTasks} pending`}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="pending"
              fill={chartConfig.pending.color}
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="completed"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.completed.color}
              className="stroke-transparent stroke-2"
            />

          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total taks for the last month
        </div>
      </CardFooter>
    </Card>
  )
} 