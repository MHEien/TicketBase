import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { pageQueryOptions } from "@/utils/pages";
import { PageEditor } from "@repo/editor/components/index"
import { pagesApi, getEnabledPlugins } from "@ticketbase/api";
import { useSession } from "@/lib/auth-client";
import "@/lib/api-config"; // Initialize API client authentication


export const Route = createFileRoute("/admin/pages/edit/$pageId")({
  loader: async ({ params: { pageId }, context }) => {
    // Validate pageId - should be 'new' or a valid UUID, and not contain file extensions
    if (pageId.includes('.') || (pageId !== "new" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pageId))) {
      throw new Error(`Invalid page ID: ${pageId}`);
    }

    let data = null;

    if (pageId !== "new") {
      data = await context.queryClient.ensureQueryData(
        pageQueryOptions(pageId),
      );
    } else {
      data = {
        id: "new",
        title: "",
        content: "",
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
  const { page } = Route.useLoaderData();
  const { data: session } = useSession();

  console.log("🔧 EditorPage: Session data:", session);
  console.log("🔧 EditorPage: User organization ID:", session?.user?.organizationId);

  // Load enabled plugins using authenticated API client
  const { data: plugins, isLoading: pluginsLoading } = useQuery({
    queryKey: ['enabled-plugins', session?.user?.organizationId],
    queryFn: () => getEnabledPlugins(session?.user?.organizationId!),
    enabled: !!session?.user?.organizationId,
  });

  console.log("🔧 EditorPage: Loaded plugins:", plugins);

  let pageQuery = null;
  if (pageId !== "new") {
    pageQuery = useSuspenseQuery(pageQueryOptions(pageId));
    // Merge loader data with query data and add organization ID
    pageQuery.data = { 
      ...pageQuery.data, 
      ...page,
      organizationId: pageQuery.data.organizationId || session?.user?.organizationId
    };
  } else {
    pageQuery = {
      data: {
        ...page,
        organizationId: session?.user?.organizationId
      }
    }
  }

  const initialPage = pageQuery.data;

  const handleSavePageData = async (pageData: any, puckData?: any) => {
    // Combine page metadata with Puck content data
    const payload = {
      ...pageData,
      content: puckData || pageData.content, // Use puckData if provided, fallback to pageData.content
    };
    
    console.log('Admin app saving page:', { pageId, pageData, puckData, payload });
    
    if (pageId !== "new") {
      await pagesApi.updatePage(pageId, payload);
    } else {
      await pagesApi.createPage(payload);
    }
  };
  
  // Show loading state while plugins are loading
  if (pluginsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading editor and plugins...</span>
      </div>
    );
  }

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

  return <PageEditor 
    initialPage={initialPage} 
    onSavePageData={handleSavePageData} 
    plugins={plugins || []} 
  />;
}
