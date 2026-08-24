/* eslint-disable react-hooks/refs */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

const CLICK_TOLERANCE = 10;
const SLIDE_THRESHOLD = 40;

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragStartX = useRef(0);
  const draggedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragging || banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dragging, banners.length]);

  function goTo(i: number) {
    setIndex(i);
  }

  function handlePointerDown(e: React.PointerEvent) {
    setDragging(true);
    draggedRef.current = false;
    dragStartX.current = e.clientX;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const offset = e.clientX - dragStartX.current;
    if (Math.abs(offset) > CLICK_TOLERANCE) draggedRef.current = true;
    setDragOffset(offset);
  }

  function handlePointerUp() {
    if (!dragging) return;
    if (dragOffset > SLIDE_THRESHOLD) {
      setIndex((i) => (i - 1 + banners.length) % banners.length);
    } else if (dragOffset < -SLIDE_THRESHOLD) {
      setIndex((i) => (i + 1) % banners.length);
    }
    setDragging(false);
    setDragOffset(0);
  }

  function handleLinkClick(e: React.MouseEvent) {
    if (draggedRef.current) e.preventDefault();
  }

  if (banners.length === 0) return null;

  const baseTranslate = -index * 100;
  const dragPercent = trackRef.current
    ? (dragOffset / trackRef.current.clientWidth) * 100
    : 0;

  const activeBanner = banners[index];

  return (
    <div className="relative w-full h-[55vh] md:h-[65vh] min-h-[380px] md:min-h-[480px] overflow-hidden select-none bg-neutral-900">
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
            !dragging && "transition-transform duration-700 ease-out"
          )}
          style={{ transform: `translateX(${baseTranslate + dragPercent}%)` }}
        >
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={
                banner.categoryId
                  ? `/category/${banner.categoryId}`
                  : banner.linkUrl || "#"
              }
              onClick={handleLinkClick}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
              className="relative w-full h-full shrink-0 block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
            </Link>
          ))}
        </div>
      </div>

      {activeBanner?.title && (
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="mx-auto max-w-7xl w-full px-6 md:px-10 pb-16 md:pb-20">
            <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-white/70 mb-2">
              Farzara Store
            </p>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight max-w-2xl">
              {activeBanner.title}
            </h1>
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
