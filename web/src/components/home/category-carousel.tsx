"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Category } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";

interface CategoryCarouselProps {
  category: Category;
  products: Product[];
}

export function CategoryCarousel({
  category,
  products,
}: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || products.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;

    const timer = setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.8,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [paused, products.length]);

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section
      className="py-8 border-b"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between px-6 md:px-10 mb-4">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/category/${category.id}`}
            className="text-sm text-muted-foreground hover:text-foreground mr-2"
          >
            View All
          </Link>
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="h-9 w-9 rounded-full border flex items-center justify-center hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-6 md:px-10 pb-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[45vw] sm:w-56 shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
