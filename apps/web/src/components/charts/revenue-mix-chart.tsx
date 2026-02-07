import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueMixChartProps {
  data: Array<{ name: string; value: number }>;
  currencyFormatter: Intl.NumberFormat;
  compactCurrencyFormatter: Intl.NumberFormat;
}

export function RevenueMixChart({ data, currencyFormatter, compactCurrencyFormatter }: RevenueMixChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5e54" }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#4b5e54" }}
          tickFormatter={(value) => compactCurrencyFormatter.format(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d9d5",
            borderRadius: "12px",
          }}
          formatter={(value: number) => currencyFormatter.format(value)}
        />
        <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
