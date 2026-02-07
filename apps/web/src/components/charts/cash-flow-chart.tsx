import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CashFlowChartProps {
  data: Array<{ month: string; income: number; expenses: number }>;
  currencyFormatter: Intl.NumberFormat;
  compactCurrencyFormatter: Intl.NumberFormat;
}

export function CashFlowChart({ data, currencyFormatter, compactCurrencyFormatter }: CashFlowChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 10, right: 10 }}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#4b5e54" }} />
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
        <Area
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#incomeFill)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#fb7185"
          strokeWidth={2}
          fill="url(#expenseFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
