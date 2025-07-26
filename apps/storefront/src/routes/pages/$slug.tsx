import { createFileRoute } from "@tanstack/react-router";
import { getCurrentOrganization } from "../../lib/server-organization";
import { pagesApi } from "../../lib/api/pages";
import { useBaseSEO } from "../../hooks/use-seo";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageRenderer } from "../../lib/puck/renderer";

export const Route = createFileRoute("/pages/$slug")({
  component: PageComponent,
  loader: async ({ params }) => {
    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("Organization not found");
    }

    try {
      const page = await pagesApi.getBySlug(params.slug, organization.id);
      return { organization, page };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Page not found");
      }
      throw error;
    }
  },
});

function PageComponent() {
  const { organization, page } = Route.useLoaderData();

  // Apply SEO for the page
  useBaseSEO({
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description || `${page.title} - ${organization.name}`,
    keywords: page.seoKeywords ? page.seoKeywords.split(',').map(k => k.trim()) : [page.title, organization.name],
    image: page.featuredImage,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <PageRenderer data={page.content} />
      </main>
      
      <Footer />
    </div>
  );
}
