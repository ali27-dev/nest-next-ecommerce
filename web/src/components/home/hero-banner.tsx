import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <div className="relative w-full h-[55vh] md:h-[65vh] min-h-[380px] md:min-h-[480px] overflow-hidden bg-neutral-900 flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl w-full px-6 md:px-10">
        <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-white/60 mb-4">
          New Season
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-3xl">
          Farzara Store
        </h1>
        <p className="text-white/70 mt-5 max-w-lg text-sm md:text-base leading-relaxed">
          Menswear, womenswear, watches, shoes, and perfumes — crafted for
          everyday wear.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 px-8 rounded-full bg-white text-foreground hover:bg-white/90"
        >
          <Link href="#categories">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
}
