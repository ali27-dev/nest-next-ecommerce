import Link from "next/link";
import { cn } from "@/lib/utils";

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoPageLayout({
  title,
  subtitle,
  children,
  className,
}: InfoPageLayoutProps) {
  return (
    <div className={cn("bg-neutral-50/80 min-h-[60vh]", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-10 py-10 md:py-16">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mx-auto mt-5 h-px w-12 bg-foreground/20" />
        </header>
        <div className="space-y-6">{children}</div>
        <p className="text-center mt-10 md:mt-14">
          <Link
            href="/support"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Still need help? Open a support ticket →
          </Link>
        </p>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title?: string;
  children: React.ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-5 md:p-6 shadow-sm">
      {title && (
        <h2 className="text-base md:text-lg font-semibold mb-3">{title}</h2>
      )}
      <div className="text-sm md:text-[15px] text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
