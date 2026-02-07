import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

interface SpendingMixChartProps {
  data: SpendingCategory[];
  currencyFormatter: Intl.NumberFormat;
}

export function SpendingMixChart({ data, currencyFormatter }: SpendingMixChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1d9d5",
            borderRadius: "12px",
          }}
          formatter={(value: number) => currencyFormatter.format(value)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
