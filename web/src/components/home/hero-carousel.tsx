"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/product";
import { cn } from "@/lib/utils";

function getBannerImage(slug: string) {
  return `https://picsum.photos/seed/${slug}-farzara/1600/900`;
}

const CLICK_TOLERANCE = 6; // px of movement still counted as a plain tap
const SLIDE_THRESHOLD = 50; // px of movement needed to switch slides

export function HeroCarousel({ categories }: { categories: Category[] }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragStartX = useRef(0);
  const draggedRef = useRef(false); // synchronous, no render-timing issues
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const slides = categories;

  useEffect(() => {
    if (dragging || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dragging, slides.length]);

  function goTo(i: number) {
    setIndex(i);
  }

  function handlePointerDown(e: React.PointerEvent) {
    setDragging(true);
    draggedRef.current = false;
    dragStartX.current = e.clientX;
    trackRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const offset = e.clientX - dragStartX.current;
    if (Math.abs(offset) > CLICK_TOLERANCE) {
      draggedRef.current = true;
    }
    setDragOffset(offset);
  }

  function handlePointerUp() {
    if (!dragging) return;

    if (dragOffset > SLIDE_THRESHOLD) {
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    } else if (dragOffset < -SLIDE_THRESHOLD) {
      setIndex((i) => (i + 1) % slides.length);
    }

    setDragging(false);
    setDragOffset(0);
  }

  function handleLinkClick(e: React.MouseEvent) {
    if (draggedRef.current) {
      e.preventDefault();
    }
  }

  if (slides.length === 0) return null;

  const baseTranslate = -index * 100;
  // eslint-disable-next-line react-hooks/refs
  const dragPercent = trackRef.current
    ? // eslint-disable-next-line react-hooks/refs
      (dragOffset / trackRef.current.clientWidth) * 100
    : 0;

  return (
    <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden select-none">
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
            !dragging && "transition-transform duration-500 ease-out"
          )}
          style={{ transform: `translateX(${baseTranslate + dragPercent}%)` }}
        >
          {slides.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              onClick={handleLinkClick}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
              className="relative w-full h-full shrink-0 bg-cover bg-center block"
              style={{
                backgroundImage: `url(${getBannerImage(category.slug)})`,
                width: "100%",
              }}
              aria-label={`Shop ${category.name}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
