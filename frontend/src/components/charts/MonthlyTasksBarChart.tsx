import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "../ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface DataPoint {
  date: string;
  count: number;
}

interface MonthlyTasksBarChartProps {
  data: DataPoint[];
  chartConfig: ChartConfig;
}

export default function MonthlyTasksBarChart({
  data,
  chartConfig,
}: MonthlyTasksBarChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Daily Task Completion</CardTitle>
        <CardDescription>Tasks completed per day</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto h-[200px]"
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} // Mostrará el día de la semana y el número del día (ej. Lun 15)
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="date" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 