/* eslint-disable react-hooks/refs */
// src/components/product/product-card.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useQuickAdd } from "@/contexts/quick-add-context";

const CLICK_TOLERANCE = 6;
const SLIDE_THRESHOLD = 30;
const AUTO_CYCLE_MS = 1200;

export function ProductCard({ product }: { product: Product }) {
  const { openQuickAdd } = useQuickAdd();

  const images = [
    product.imageUrl,
    product.secondaryImageUrl,
    ...(product.galleryImages ?? []),
  ].filter(
    (img, i, arr): img is string => Boolean(img) && arr.indexOf(img) === i
  );

  const pointerTypeRef = useRef<string>("mouse");
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const draggedRef = useRef(false);
  const dragStartX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasDiscount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - Number(product.price) / Number(product.compareAtPrice)) * 100
      )
    : null;

  useEffect(() => {
    if (hovered && !dragging && images.length > 1) {
      autoTimerRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % images.length);
      }, AUTO_CYCLE_MS);
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [hovered, dragging, images.length]);

  function handleMouseLeave() {
    setHovered(false);
    setIndex(0);
  }

  function handlePointerDown(e: React.PointerEvent) {
    pointerTypeRef.current = e.pointerType;
    setDragging(true);
    draggedRef.current = false;
    dragStartX.current = e.clientX;
    if (e.pointerType !== "mouse") {
      trackRef.current?.setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    if (pointerTypeRef.current === "mouse") return; // mouse never counts as a drag
    const offset = e.clientX - dragStartX.current;
    if (Math.abs(offset) > CLICK_TOLERANCE) draggedRef.current = true;
    setDragOffset(offset);
  }

  function handlePointerUp() {
    if (!dragging) return;
    if (pointerTypeRef.current !== "mouse") {
      if (dragOffset > SLIDE_THRESHOLD) {
        setIndex((i) => (i - 1 + images.length) % images.length);
      } else if (dragOffset < -SLIDE_THRESHOLD) {
        setIndex((i) => (i + 1) % images.length);
      }
    }
    setDragging(false);
    setDragOffset(0);
  }

  function handleLinkClick(e: React.MouseEvent) {
    if (draggedRef.current) e.preventDefault();
  }

  const baseTranslate = -index * 100;
  const dragPercent = trackRef.current
    ? (dragOffset / trackRef.current.clientWidth) * 100
    : 0;

  return (
    <article
      className="group relative w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-xl select-none">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "pan-y" }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          <div
            className={cn(
              "flex h-full w-full",
              !dragging && "transition-transform duration-400 ease-out"
            )}
            style={{ transform: `translateX(${baseTranslate + dragPercent}%)` }}
          >
            {images.map((img, i) => (
              <Link
                key={img + i}
                href={`/products/${product.id}`}
                onClick={handleLinkClick}
                onDragStart={(e) => e.preventDefault()}
                draggable={false}
                className="relative w-full h-full shrink-0 block"
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </Link>
            ))}
          </div>
        </div>

        {hasDiscount && (
          <span
            className="absolute top-3 left-3 text-[11px] font-bold tracking-wide px-2.5 py-1 rounded pointer-events-none"
            style={{ backgroundColor: "#d31919", color: "#fefcfc" }}
          >
            {discountPercent}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-neutral-800 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded pointer-events-none">
            SOLD OUT
          </span>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            openQuickAdd(product);
          }}
          disabled={product.stock === 0}
          aria-label={`Quick add ${product.name}`}
          className={cn(
            "absolute bottom-3 right-3 z-10 h-11 w-11 rounded-full bg-background shadow-md flex items-center justify-center transition-opacity duration-200 disabled:opacity-40",
            "opacity-100 md:opacity-0 md:group-hover:opacity-100"
          )}
        >
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>

      <div className="pt-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-normal leading-snug truncate">
            {product.name}
          </h3>
        </Link>
        <p className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {Number(product.compareAtPrice).toLocaleString()}
            </span>
          )}
          <span className="text-sm font-semibold">
            Rs. {Number(product.price).toLocaleString()}
          </span>
        </p>
      </div>
    </article>
  );
}
