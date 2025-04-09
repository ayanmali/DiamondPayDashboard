import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CustomChartProps {
  data: any[];
  valueKey?: string;
  dateKey?: string;
  timeFormat?: string;
  color?: "primary" | "secondary" | "accent";
  showGrid?: boolean;
  height?: number;
  showTooltip?: boolean;
  emptyState?: boolean;
  emptyLine?: boolean;
  startLabel?: string;
  endLabel?: string;
}

export default function CustomChart({
  data,
  valueKey = "value",
  dateKey = "date",
  timeFormat = "MMM d",
  color = "primary",
  showGrid = false,
  height = 100,
  showTooltip = true,
  emptyState = false,
  emptyLine = false,
  startLabel,
  endLabel,
}: CustomChartProps) {
  // Map the color to the CSS variable
  const getColorFromTheme = (colorName: string): string => {
    switch (colorName) {
      case "primary":
        return "hsl(var(--primary))";
      case "secondary":
        return "hsl(var(--secondary))";
      case "accent":
        return "hsl(var(--accent))";
      default:
        return "hsl(var(--primary))";
    }
  };

  const chartColor = getColorFromTheme(color);
  const gridColor = "hsl(var(--border))";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-border rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  };

  if (emptyState) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-px bg-muted relative">
          <div className="absolute w-2 h-2 rounded-full bg-primary" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
        </div>
        {startLabel && endLabel && (
          <div className="flex justify-between w-full absolute bottom-0 text-xs text-muted-foreground">
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>
        )}
      </div>
    );
  }

  if (emptyLine) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-px bg-primary bg-opacity-50"></div>
        {startLabel && endLabel && (
          <div className="flex justify-between w-full absolute bottom-0 text-xs text-muted-foreground">
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
            />
          )}
          <XAxis
            dataKey={dateKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            hide={!showGrid}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Area
            type="monotone"
            dataKey={valueKey}
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
