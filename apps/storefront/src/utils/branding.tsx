import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentOrganization } from "~/lib/server-organization";

export const fetchOrganizationBranding = createServerFn({ method: "GET" })
  .handler(async () => {
    const organization = await getCurrentOrganization();
    return organization;
  });

export const brandingQueryOptions = () =>
  queryOptions({
    queryKey: ["branding"],
    queryFn: () => fetchOrganizationBranding(),
  });
