import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";
import {
  pieceCountLabel,
  seasonLabel,
  stitchTypeLabel,
} from "@/lib/product-labels";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: Product;
  try {
    product = await apiFetch<Product>(`/products/${id}`);
  } catch {
    notFound();
  }

  const allImages = [
    product.imageUrl,
    product.secondaryImageUrl,
    ...product.galleryImages,
  ].filter((img): img is string => Boolean(img));

  const piece = pieceCountLabel(product.pieceCount);
  const season = seasonLabel(product.season);
  const stitch = stitchTypeLabel(product.stitchType);
  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);

  return (
    <div className="px-6 md:px-10 py-6">
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.id}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ImageGallery images={allImages} alt={product.name} />

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <p className="text-xl font-mono font-medium">
              Rs {Number(product.price).toLocaleString()}
            </p>
            {hasDiscount && (
              <p className="text-base font-mono text-muted-foreground line-through">
                Rs {Number(product.compareAtPrice).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {piece && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                {piece}
              </span>
            )}
            {season && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                {season}
              </span>
            )}
            {stitch && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                {stitch}
              </span>
            )}
          </div>

          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-semibold underline mb-3">
              Description
            </h2>
            <dl className="text-sm space-y-1.5 text-muted-foreground">
              {product.description && (
                <p className="text-foreground mb-2">{product.description}</p>
              )}
              {product.fabric && (
                <div className="flex gap-1">
                  <dt className="font-medium text-foreground">Fabric:</dt>
                  <dd>{product.fabric.name}</dd>
                </div>
              )}
              {product.color && (
                <div className="flex gap-1">
                  <dt className="font-medium text-foreground">Color:</dt>
                  <dd>{product.color}</dd>
                </div>
              )}
              <div className="flex gap-1">
                <dt className="font-medium text-foreground">SKU:</dt>
                <dd>{product.sku}</dd>
              </div>
            </dl>
          </div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="care">
              <AccordionTrigger className="text-sm font-semibold">
                Care Instructions
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Machine wash cold with similar colors. Do not bleach. Tumble dry
                low. Iron on low heat if needed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="disclaimer">
              <AccordionTrigger className="text-sm font-semibold">
                Disclaimer
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Actual color may vary slightly due to photography and screen
                settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
