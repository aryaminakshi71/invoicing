import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Invoices</h2>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Paid This Month</h2>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Outstanding</h2>
          <p className="text-3xl font-bold">-</p>
        </div>
      </div>
    </div>
  );
}
