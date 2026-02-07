import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
      <p className="text-muted-foreground">
        Knowledge base articles coming soon.
      </p>
    </div>
  );
}
