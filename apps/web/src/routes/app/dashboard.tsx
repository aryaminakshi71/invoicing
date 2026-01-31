import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarClock,
  CreditCard,
  Landmark,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

const summaryCards = [
  {
    title: "Net Cash Position",
    value: 58240,
    change: 12.5,
    trend: "up",
    icon: Wallet,
    description: "assets minus liabilities",
  },
  {
    title: "Monthly Revenue",
    value: 18420,
    change: 6.8,
    trend: "up",
    icon: BadgeDollarSign,
    description: "client invoices paid",
  },
  {
    title: "Operating Expenses",
    value: 9340,
    change: 3.1,
    trend: "down",
    icon: CreditCard,
    description: "vs last month",
  },
  {
    title: "Savings Rate",
    value: 28,
    change: 4.2,
    trend: "up",
    icon: PiggyBank,
    description: "target 30%",
  },
];

const cashflowData = [
  { month: "Aug", income: 15200, expenses: 9100 },
  { month: "Sep", income: 16300, expenses: 9800 },
  { month: "Oct", income: 14800, expenses: 8600 },
  { month: "Nov", income: 17250, expenses: 10400 },
  { month: "Dec", income: 18900, expenses: 11200 },
  { month: "Jan", income: 18420, expenses: 9340 },
];

const spendingCategories = [
  { name: "Operations", value: 3350, color: "#22c55e" },
  { name: "Payroll", value: 2800, color: "#14b8a6" },
  { name: "Marketing", value: 1720, color: "#f97316" },
  { name: "Software", value: 980, color: "#0ea5e9" },
  { name: "Facilities", value: 490, color: "#a855f7" },
];

const budgetCategories = [
  { name: "Payroll", budget: 4200, spent: 3900, trend: "steady" },
  { name: "Marketing", budget: 2200, spent: 1720, trend: "under" },
  { name: "Operations", budget: 3600, spent: 3350, trend: "near" },
  { name: "Software", budget: 1200, spent: 980, trend: "under" },
  { name: "Facilities", budget: 800, spent: 490, trend: "under" },
];

const investmentHoldings = [
  { name: "Treasury Ladder", allocation: 45, value: 24800, change: 2.4 },
  { name: "Index Funds", allocation: 35, value: 19300, change: 5.9 },
  { name: "Cash Sweep", allocation: 12, value: 6620, change: 1.1 },
  { name: "Alternatives", allocation: 8, value: 4440, change: -0.8 },
];

const upcomingPayments = [
  { name: "Vendor Payouts", date: "Feb 3", amount: 1320 },
  { name: "Payroll Run", date: "Feb 5", amount: 4860 },
  { name: "Office Lease", date: "Feb 8", amount: 2100 },
  { name: "Tax Withholding", date: "Feb 12", amount: 1750 },
];

const savingsGoals = [
  { name: "Emergency Reserve", target: 80000, current: 62000 },
  { name: "Tax Buffer", target: 24000, current: 18200 },
  { name: "Growth Fund", target: 50000, current: 29400 },
];

const recentTransactions = [
  { name: "Acme Corp Invoice", date: "Today", amount: 4200, type: "credit" },
  { name: "Cloud Hosting", date: "Yesterday", amount: -420, type: "debit" },
  { name: "Design Retainer", date: "Jan 27", amount: -1250, type: "debit" },
  { name: "Nova Labs", date: "Jan 26", amount: 2800, type: "credit" },
  { name: "Ad Spend", date: "Jan 24", amount: -640, type: "debit" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="container mx-auto space-y-10 px-4 py-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Finance Command Center
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Cash flow, budgets, and investments at a glance
            </h1>
            <p className="mt-2 max-w-2xl text-base text-gray-600">
              Monitor incoming payments, control spend, and keep every account in sync with your invoicing pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800">
              Link Bank Accounts
            </button>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              New Transfer
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.trend === "up";
            return (
              <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-500">{card.title}</p>
                  <div className="rounded-full bg-emerald-50 p-2">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {card.title === "Savings Rate"
                      ? `${card.value}%`
                      : currencyFormatter.format(card.value)}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      isPositive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {card.change}%
                  </div>
                </div>
                <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cash Flow</h2>
                <p className="text-sm text-gray-500">Income vs expenses across the last 6 months</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Expenses
                </span>
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowData} margin={{ left: 10, right: 10 }}>
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
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) => compactCurrencyFormatter.format(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
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
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <p className="text-sm text-gray-500">Last updated 2 hours ago</p>
              </div>
              <button className="text-xs font-semibold text-emerald-700">View all</button>
            </div>
            <div className="mt-6 space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        transaction.type === "credit" ? "bg-emerald-50" : "bg-rose-50"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{transaction.name}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "credit" ? "text-emerald-700" : "text-gray-900"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {currencyFormatter.format(Math.abs(transaction.amount))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Budget Performance</h2>
                <p className="text-sm text-gray-500">Month-to-date spend across departments</p>
              </div>
              <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                Edit budgets
              </button>
            </div>
            <div className="mt-6 space-y-5">
              {budgetCategories.map((category) => {
                const percentUsed = Math.round((category.spent / category.budget) * 100);
                const isOver = percentUsed > 100;
                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">
                          {currencyFormatter.format(category.spent)} of {currencyFormatter.format(category.budget)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isOver ? "text-rose-600" : "text-gray-600"
                          }`}
                        >
                          {percentUsed}%
                        </span>
                        {isOver ? (
                          <TrendingUp className="h-4 w-4 text-rose-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${
                          isOver ? "bg-rose-400" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Spending Mix</h2>
                <p className="text-sm text-gray-500">Where expenses are concentrated</p>
              </div>
              <Landmark className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={spendingCategories} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {spendingCategories.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => currencyFormatter.format(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {spendingCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-gray-600">{category.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {currencyFormatter.format(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
                <p className="text-sm text-gray-500">Next 10 days of outflows</p>
              </div>
              <CalendarClock className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-6 space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{payment.name}</p>
                    <p className="text-xs text-gray-500">Due {payment.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {currencyFormatter.format(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300">
              Manage payment calendar
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Investment Allocation</h2>
                <p className="text-sm text-gray-500">Portfolio health and liquidity stance</p>
              </div>
              <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                Rebalance
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Holding</th>
                    <th className="px-4 py-3">Allocation</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {investmentHoldings.map((holding) => (
                    <tr key={holding.name} className="text-gray-700">
                      <td className="px-4 py-3 font-semibold text-gray-900">{holding.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-700">{holding.allocation}%</span>
                          <div className="h-2 w-full max-w-[160px] rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${holding.allocation}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{currencyFormatter.format(holding.value)}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          holding.change >= 0 ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {holding.change >= 0 ? "+" : ""}
                        {holding.change}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <p>Liquidity coverage ratio: 1.8x</p>
              <p>Next rebalance window: Feb 15</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Savings Goals</h2>
                <p className="text-sm text-gray-500">Progress toward financial cushions</p>
              </div>
              <PiggyBank className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-6 space-y-4">
              {savingsGoals.map((goal) => {
                const progress = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={goal.name}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-semibold text-gray-900">{goal.name}</p>
                      <p className="text-xs text-gray-500">
                        {currencyFormatter.format(goal.current)} / {currencyFormatter.format(goal.target)}
                      </p>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{progress}% funded</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Mix</h2>
                <p className="text-sm text-gray-500">Top income streams this quarter</p>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="mt-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Retainers", value: 42800 },
                    { name: "Projects", value: 31200 },
                    { name: "Usage", value: 18400 },
                    { name: "Support", value: 8600 },
                  ]}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) => compactCurrencyFormatter.format(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => currencyFormatter.format(value)}
                  />
                  <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              67% of revenue is recurring, improving forecast stability.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
