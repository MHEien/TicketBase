import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageEditor } from "@/components/editor"; 
import { Loader2 } from "lucide-react";
import { pageQueryOptions } from "@/utils/pages";

export const Route = createFileRoute("/admin/pages/edit/$pageId")({
  loader: async ({ params: { pageId }, context }) => {
    let data = null;
    if (pageId !== "new") {
      data = await context.queryClient.ensureQueryData(
        pageQueryOptions(pageId),
      );
    } else {
      data = {
        id: "new",
        title: "",
      };
    }
    
    return {
      page: data,
    };
  },
  component: EditorPage,
});

function EditorPage() {
  const { pageId } = Route.useParams();

  let pageQuery = null;
  if (pageId !== "new") {
    pageQuery = useSuspenseQuery(pageQueryOptions(pageId));
  } else {
    pageQuery = {
      data: {
        id: "new",
        title: "",
        content: "",
      },
    }
  }

  const initialPage = pageQuery.data;
  
  if (!initialPage) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading page...</span>
      </div>
    );
  }

  if (pageQuery.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error loading page</h2>
          <p className="text-sm text-gray-600 mt-2">
            {pageQuery.error instanceof Error ? pageQuery.error.message : "Failed to load page"}
          </p>
        </div>
      </div>
    );
  }

  if (!initialPage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Page not found</h2>
          <p className="text-sm text-gray-600 mt-2">
            The requested page could not be found.
          </p>
        </div>
      </div>
    );
  }

  return <PageEditor initialPage={initialPage} />;
}
