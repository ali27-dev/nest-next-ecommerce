import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View All",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("text-center mb-10 md:mb-12", className)}>
      {subtitle && (
        <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-foreground/20" />
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          {linkText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </header>
  );
}
