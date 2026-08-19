import { apiFetch } from "@/lib/api";
import { Fabric, ProductListResponse } from "@/types/product";
import { SearchPageContent } from "@/components/search/search-page-content";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    season?: string;
    pieceCount?: string;
    fabricId?: string;
    onSale?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Number(params.page) || 1;

  const apiParams = new URLSearchParams();
  if (query) apiParams.set("search", query);
  if (params.season) apiParams.set("season", params.season);
  if (params.pieceCount) apiParams.set("pieceCount", params.pieceCount);
  if (params.fabricId) apiParams.set("fabricId", params.fabricId);
  if (params.onSale) apiParams.set("onSale", "true");
  if (params.sort) apiParams.set("sort", params.sort);
  apiParams.set("page", String(page));
  apiParams.set("limit", "20");

  const hasAnyCriteria =
    query ||
    params.season ||
    params.pieceCount ||
    params.fabricId ||
    params.onSale;

  const [result, fabrics] = await Promise.all([
    hasAnyCriteria
      ? apiFetch<ProductListResponse>(`/products?${apiParams.toString()}`)
      : Promise.resolve<ProductListResponse>({
          products: [],
          meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
        }),
    apiFetch<Fabric[]>("/fabrics"),
  ]);

  return (
    <SearchPageContent
      query={query}
      initialResult={result}
      fabrics={fabrics}
      activeParams={params}
    />
  );
}
