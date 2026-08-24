-- Preserve the selected variant throughout cart and order history.
ALTER TABLE "carts_items" ADD COLUMN "size" TEXT NOT NULL DEFAULT '';
ALTER TABLE "order_items" ADD COLUMN "size" TEXT NOT NULL DEFAULT '';

DROP INDEX "carts_items_cartId_productId_key";
CREATE UNIQUE INDEX "carts_items_cartId_productId_size_key"
  ON "carts_items"("cartId", "productId", "size");
