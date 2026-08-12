import { apiFetch } from "@/lib/api";
import { Category, Product, ProductListResponse } from "@/types/product";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryCarousel } from "@/components/home/category-carousel";

export default async function Home() {
  const categories = await apiFetch<Category[]>("/categories");

  const productsByCategory = await Promise.all(
    categories.map((category) =>
      apiFetch<ProductListResponse>(
        `/products?categoryId=${category.id}&limit=8`
      )
    )
  );

  return (
    <div>
      <HeroCarousel categories={categories} />
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
