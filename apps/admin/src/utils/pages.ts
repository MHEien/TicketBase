import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { pagesApi } from "@/lib/api/pages";

export const fetchPages = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching pages...");
    return pagesApi.getPages();
  },
);

export const pagesQueryOptions = () =>
  queryOptions({
    queryKey: ["pages"],
    queryFn: () => fetchPages(),
  });

export const fetchPage = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.log('Page ID', data)
    console.info(`Fetching page with id ${data}...`);
    const page = await pagesApi.getPage(data);
    return page;
  });

export const pageQueryOptions = (pageId: string) =>
  queryOptions({
    queryKey: ["page", pageId],
    queryFn: () => fetchPage({ data: pageId }),
  });
