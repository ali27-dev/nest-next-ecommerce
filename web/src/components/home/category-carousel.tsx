"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Category } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/home/section-header";
import { HomeSection } from "@/components/home/home-section";
import { getCategoryTheme } from "@/lib/category-theme";

interface CategoryCarouselProps {
  category: Category;
  products: Product[];
  variant?: "default" | "muted";
}

export function CategoryCarousel({
  category,
  products,
  variant = "default",
}: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const theme = getCategoryTheme(category.slug);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products.length]);

  useEffect(() => {
    if (paused || products.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;

    const timer = setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.75,
        behavior: "smooth",
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [paused, products.length]);

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <HomeSection variant={variant}>
      <SectionHeader
        title={category.name}
        subtitle={theme.tagline}
        href={`/category/${category.id}`}
      />

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute -left-4 top-[38%] -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-background border shadow-md items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute -right-4 top-[38%] -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-background border shadow-md items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[44vw] sm:w-56 md:w-64 lg:w-72 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
