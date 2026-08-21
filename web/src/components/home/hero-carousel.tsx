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
    }, 5000);
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
    // trackRef.current?.setPointerCapture(e.pointerId);
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
    console.log(
      "handleLinkClick fired, draggedRef.current =",
      draggedRef.current
    );
    if (draggedRef.current) e.preventDefault();
  }

  if (banners.length === 0) return null;

  const baseTranslate = -index * 100;
  const dragPercent = trackRef.current
    ? (dragOffset / trackRef.current.clientWidth) * 100
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
              className="relative w-full h-full shrink-0 bg-cover bg-center block"
              style={{
                backgroundImage: `url(${banner.imageUrl})`,
                width: "100%",
              }}
              aria-label={banner.title ?? "Shop now"}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
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
