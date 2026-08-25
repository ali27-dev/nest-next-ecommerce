import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background/25 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24 relative">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-background/60 mb-4">
            Farzara Store
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            Style That Speaks for You
          </h2>
          <p className="mt-4 text-sm md:text-base text-background/70 leading-relaxed max-w-lg mx-auto">
            From everyday essentials to statement pieces — discover curated
            fashion for men, women, and kids with watches, shoes, and perfumes
            to complete your look.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 bg-background text-foreground hover:bg-background/90 rounded-full"
            >
              <Link href="/search">Explore Collection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-full border-background/30 text-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/support">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
