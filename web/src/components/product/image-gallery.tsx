"use client";

import { useState } from "react";

export function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[3/4] bg-muted rounded-lg" />;
  }

  return (
    <div className="flex gap-4">
      <div className="hidden sm:flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={`h-20 w-16 rounded-md overflow-hidden border-2 transition-colors ${
              i === active ? "border-primary" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`${alt} view ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-[3/4] rounded-lg overflow-hidden bg-muted">
        <img
          src={images[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
