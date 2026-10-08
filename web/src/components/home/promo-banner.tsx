import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 via-rose-50 to-amber-50 text-foreground border-t">
      {/* soft decorative glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-14 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-muted-foreground mb-4">
            Farzara Store
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Style That Speaks for You
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            From everyday essentials to statement pieces — discover curated
            fashion for men, women, and kids with watches, shoes, and perfumes
            to complete your look.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-8">
            <Button asChild size="lg" className="h-12 px-8 rounded-full">
              <Link href="/search">Explore Collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full bg-background/70 hover:bg-background"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
