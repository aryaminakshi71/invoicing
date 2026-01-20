import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  const { data, isLoading, error } = useQuery(
    orpc.knowledge.list.useQuery({
      limit: 50,
      offset: 0,
    })
  );

  if (isLoading) return <div>Loading knowledge base...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
      <div className="space-y-4">
        {data?.data?.map((article: any) => (
          <div key={article.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600">{article.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
