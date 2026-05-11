"use client";
import { MeasurementPoint } from "@/communication/patientHealthHistoryCommunication";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
type HealthDataGraphProps = {
  title: string;
  history: MeasurementPoint[];
  historyLoading: boolean;
};

export function HealthDataGraph({
  title,
  history,
  historyLoading,
}: HealthDataGraphProps) {
  const dataKey =
    title === "Pulse"
      ? "heart_rate"
      : title === "Body Temperature"
        ? "temperature"
        : "blood_oxygen";

  const unit =
    title === "Pulse" ? " bpm" : title === "Body Temperature" ? " °C" : " %";

  const chartData = [...history].reverse().map((m) => ({
    time: new Date(m.recorded_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: m[dataKey as keyof MeasurementPoint],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recent measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <p className="text-sm text-slate-400 py-8 text-center animate-pulse">
            Loading...
          </p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            No data available
          </p>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                unit={unit}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="value"
                type="monotone"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
