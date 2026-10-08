import Link from "next/link";
import { Category } from "@/types/product";
import { getCategoryIcon } from "@/lib/category-icons";
import { getCategoryTheme } from "@/lib/category-theme";
import { cn } from "@/lib/utils";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);
        const theme = getCategoryTheme(category.slug);
        const tagline = category.tagline || theme.tagline;

        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-muted ring-1 ring-border/50 hover:ring-foreground/20 transition-all duration-300 hover:shadow-lg"
          >
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-90",
                  theme.gradient
                )}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 md:p-5 text-center text-white">
              <div className="mb-2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm md:text-base font-semibold tracking-wide">
                {category.name}
              </h3>
              {/* Always visible on touch devices, hover-reveal on desktop */}
              <p className="text-[11px] md:text-xs text-white/80 mt-1 line-clamp-2 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                {tagline}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
