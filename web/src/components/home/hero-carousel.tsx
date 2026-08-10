"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types/product";
import { getCategoryTheme } from "@/lib/category-theme";
import { cn } from "@/lib/utils";

export function HeroCarousel({ categories }: { categories: Category[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = categories.length > 0 ? categories : [];

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  function goTo(i: number) {
    setIndex(i);
  }
  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full h-[60vh] min-h-[420px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((category, i) => {
        const theme = getCategoryTheme(category.slug);
        return (
          <div
            key={category.id}
            className={cn(
              "absolute inset-0 flex items-center bg-gradient-to-br transition-opacity duration-700",
              theme.gradient,
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="px-6 md:px-10">
              <p className="text-sm font-medium tracking-widest uppercase text-foreground/60 mb-3">
                {theme.tagline}
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                {category.name}
              </h1>
              <Link
                href={`/category/${category.id}`}
                className="inline-block mt-6 h-12 px-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center w-fit font-medium"
              >
                Shop Now
              </Link>
            </div>
          </div>
        );
      })}

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-foreground" : "w-2 bg-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
