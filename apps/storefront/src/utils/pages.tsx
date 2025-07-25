import { queryOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";
import type { Page } from "../lib/api/pages";
import { pagesApi } from "../lib/api/pages";

export const fetchPages = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching pages...");
    return pagesApi.getAll();
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
    console.info(`Fetching page with id ${data}...`);
    const page = await pagesApi.getBySlug(data, "")
    return page;
  });

export const pageQueryOptions = (pageId: string) =>
  queryOptions({
    queryKey: ["page", pageId],
    queryFn: () => fetchPage({ data: pageId }),
  });
