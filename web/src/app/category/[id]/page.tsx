import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Category, Fabric, ProductListResponse } from "@/types/product";
import { getCategoryTheme } from "@/lib/category-theme";
import { FilterSortBar } from "@/components/product/filter-sort-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { Banner } from "@/types/banner";
import { HeroCarousel } from "@/components/home/hero-carousel";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { id } = await params;
  const categoryBanners = await apiFetch<Banner[]>(`/banners?categoryId=${id}`);
  const sp = await searchParams;

  let category: Category;
  try {
    category = await apiFetch<Category>(`/categories/${id}`);
  } catch {
    notFound();
  }

  const queryParams = new URLSearchParams();
  queryParams.set("categoryId", id);
  if (sp.fabricId) queryParams.set("fabricId", sp.fabricId);
  if (sp.season) queryParams.set("season", sp.season);
  if (sp.pieceCount) queryParams.set("pieceCount", sp.pieceCount);
  if (sp.minPrice) queryParams.set("minPrice", sp.minPrice);
  if (sp.maxPrice) queryParams.set("maxPrice", sp.maxPrice);
  if (sp.sort) queryParams.set("sort", sp.sort);
  const queryString = queryParams.toString();

  const [{ products, meta }, fabrics] = await Promise.all([
    apiFetch<ProductListResponse>(`/products?${queryString}`),
    apiFetch<Fabric[]>("/fabrics"),
  ]);

  const theme = getCategoryTheme(category.slug);

  return (
    <div>
      {categoryBanners.length > 0 ? (
        <HeroCarousel banners={categoryBanners} />
      ) : (
        <div
          className={`w-full h-[35vh] min-h-[220px] flex items-center bg-gradient-to-br ${theme.gradient}`}
        >
          <div className="px-6 md:px-10">
            <p className="text-sm font-medium tracking-widest uppercase text-foreground/60 mb-2">
              {theme.tagline}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {category.name}
            </h1>
          </div>
        </div>
      )}

      <FilterSortBar fabrics={fabrics} total={meta.total} />

      <div className="px-6 md:px-10 py-8">
        <ProductGrid
          key={queryString}
          initialProducts={products}
          initialPage={meta.page}
          totalPages={meta.totalPages}
          queryString={queryString}
        />
      </div>
    </div>
  );
}
