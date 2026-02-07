import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>
      <p className="text-muted-foreground">
        Support ticket management coming soon.
      </p>
    </div>
  );
}
