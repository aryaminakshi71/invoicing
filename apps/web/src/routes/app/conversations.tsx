import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/conversations")({
  component: ConversationsPage,
});

function ConversationsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Conversations</h1>
      <p className="text-muted-foreground">
        Messaging and conversations coming soon.
      </p>
    </div>
  );
}
