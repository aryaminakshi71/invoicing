import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

export const Route = createFileRoute("/app/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const { data, isLoading, error } = useQuery(
    orpc.clients.list.queryOptions({
      input: {
        limit: 50,
        offset: 0,
      },
    })
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} title="Failed to load clients" />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Clients</h1>
      <div className="space-y-4">
        {data?.clients?.map((client: any) => (
          <div key={client.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{client.name}</h2>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
