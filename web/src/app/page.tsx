import { apiFetch } from "@/lib/api";
import { Category, Product, ProductListResponse } from "@/types/product";
import { Banner } from "@/types/banner";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryCarousel } from "@/components/home/category-carousel";

export default async function Home() {
  const [categories, banners] = await Promise.all([
    apiFetch<Category[]>("/categories"),
    apiFetch<Banner[]>("/banners"),
  ]);

  const productsByCategory = await Promise.all(
    categories.map((category) =>
      apiFetch<ProductListResponse>(
        `/products?categoryId=${category.id}&limit=8`
      )
    )
  );

  return (
    <div>
      <HeroCarousel banners={banners} />
      {categories.map((category, i) => (
        <CategoryCarousel
          key={category.id}
          category={category}
          products={productsByCategory[i].products}
        />
      ))}
    </div>
  );
}
