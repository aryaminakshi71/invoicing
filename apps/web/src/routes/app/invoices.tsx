import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

export const Route = createFileRoute("/app/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  const { data, isLoading, error } = useQuery(
    orpc.invoices.list.useQuery({
      limit: 50,
      offset: 0,
    })
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} title="Failed to load invoices" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>
      <div className="space-y-4">
        {data?.data?.map((invoice: any) => (
          <div key={invoice.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-gray-600">{invoice.customerName} - {invoice.status}</p>
            <p className="text-sm font-medium">${invoice.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
