import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/app/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  const { data, isLoading, error } = useQuery(
    orpc.tickets.list.useQuery({
      limit: 50,
      offset: 0,
    })
  );

  if (isLoading) return <div>Loading tickets...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>
      <div className="space-y-4">
        {data?.data?.map((ticket: any) => (
          <div key={ticket.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{ticket.title}</h2>
            <p className="text-sm text-gray-600">{ticket.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
