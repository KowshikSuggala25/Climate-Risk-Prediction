import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ForecastChartProps {
  title: string;
  description: string;
  data: Array<{
    day: string;
    risk: number;
    confidence: number;
  }>;
  riskType: "flood" | "heatwave" | "pollution";
}

const riskColors = {
  flood: "hsl(var(--climate-humidity))",
  heatwave: "hsl(var(--climate-temperature))",
  pollution: "hsl(var(--climate-pollution))",
};

export const ForecastChart = ({
  title,
  description,
  data,
  riskType,
}: ForecastChartProps) => {
  const strokeColor = riskColors[riskType];

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <div
            className={`h-3 w-3 rounded-full`}
            style={{ backgroundColor: strokeColor }}
          />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === "risk" ? "Risk Level" : "Confidence",
              ]}
            />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="none"
              fill={strokeColor}
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="risk"
              stroke={strokeColor}
              strokeWidth={3}
              dot={{ fill: strokeColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
