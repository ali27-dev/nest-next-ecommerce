import Link from "next/link";
import { Category } from "@/types/product";
import { getCategoryIcon } from "@/lib/category-icons";
import { getCategoryTheme } from "@/lib/category-theme";
import { cn } from "@/lib/utils";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);
        const theme = getCategoryTheme(category.slug);

        return (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] bg-muted ring-1 ring-border/50 hover:ring-foreground/20 transition-all duration-300 hover:shadow-lg"
          >
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-5 text-white">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm md:text-base font-semibold tracking-wide">
                {category.name}
              </h3>
              <p className="text-[11px] md:text-xs text-white/75 mt-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {theme.tagline}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
