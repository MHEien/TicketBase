import { createFileRoute } from "@tanstack/react-router";
import { FullscreenPuckApp } from "@/components/editor";

export const Route = createFileRoute("/admin/pages/edit/$pageId")({
  loader: ({ params }) => {
    return {
      pageId: params.pageId,
    };
  },
  component: EditorPage,
});

function EditorPage() {
  const { pageId } = Route.useParams();

  return <FullscreenPuckApp />;
}
