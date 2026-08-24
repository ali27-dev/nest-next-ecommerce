import { apiFetch } from "@/lib/api";
import { Category, ProductListResponse } from "@/types/product";
import { Banner } from "@/types/banner";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { HomeSection } from "@/components/home/home-section";
import { SectionHeader } from "@/components/home/section-header";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ProductShowcaseGrid } from "@/components/home/product-showcase-grid";
import { PromoBanner } from "@/components/home/promo-banner";

export default async function Home() {
  const [categories, banners, newArrivals, saleProducts] = await Promise.all([
    apiFetch<Category[]>("/categories"),
    apiFetch<Banner[]>("/banners"),
    apiFetch<ProductListResponse>("/products?sort=newest&limit=8"),
    apiFetch<ProductListResponse>("/products?onSale=true&limit=8"),
  ]);

  const productsByCategory = await Promise.all(
    categories.map((category) =>
      apiFetch<ProductListResponse>(
        `/products?categoryId=${category.id}&limit=8`
      )
    )
  );

  return (
    <>
      {banners.length > 0 ? <HeroCarousel banners={banners} /> : <HeroBanner />}
      <TrustBar />

      <HomeSection variant="muted" id="categories">
        <SectionHeader
          title="Shop by Category"
          subtitle="Curated Collections"
        />
        <CategoryShowcase categories={categories} />
      </HomeSection>

      {newArrivals.products.length > 0 && (
        <HomeSection>
          <SectionHeader
            title="New Arrivals"
            subtitle="Just Landed"
            href="/search?sort=newest"
          />
          <ProductShowcaseGrid products={newArrivals.products} />
        </HomeSection>
      )}

      {categories.map((category, i) => (
        <CategoryCarousel
          key={category.id}
          category={category}
          products={productsByCategory[i].products}
          variant={i % 2 === 0 ? "muted" : "default"}
        />
      ))}

      {saleProducts.products.length > 0 && (
        <HomeSection variant="muted">
          <SectionHeader
            title="Special Offers"
            subtitle="Limited Time"
            href="/search?onSale=true"
          />
          <ProductShowcaseGrid products={saleProducts.products} />
        </HomeSection>
      )}

      <PromoBanner />
    </>
  );
}
