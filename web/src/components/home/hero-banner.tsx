import Link from "next/link";
import { Button } from "@/components/ui/button";

// Coming soon: swap this gradient for real campaign photography once you have it.
export function HeroBanner() {
  return (
    <div className="relative w-full h-[60vh] min-h-[420px] bg-gradient-to-br from-primary/20 via-muted to-accent/20 flex items-center">
      <div className="px-6 md:px-10">
        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-3">
          New Season
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-xl">
          Farzara Store
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          Menswear, womenswear, watches, shoes, and perfumes — crafted for
          everyday wear.
        </p>
        <Button asChild size="lg" className="mt-6 h-12 px-8">
          <Link href="#products">Shop Now</Link>
        </Button>
      </div>
    </div>
  );
}
