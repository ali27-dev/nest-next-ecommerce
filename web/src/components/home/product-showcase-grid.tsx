import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

export function ProductShowcaseGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
