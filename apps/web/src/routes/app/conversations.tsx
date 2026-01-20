import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/app/conversations")({
  component: ConversationsPage,
});

function ConversationsPage() {
  const { data, isLoading, error } = useQuery(
    orpc.conversations.list.useQuery({
      limit: 50,
      offset: 0,
    })
  );

  if (isLoading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Conversations</h1>
      <div className="space-y-4">
        {data?.data?.map((conversation: any) => (
          <div key={conversation.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">Conversation {conversation.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-600">{conversation.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
