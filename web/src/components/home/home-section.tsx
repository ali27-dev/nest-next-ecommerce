import { cn } from "@/lib/utils";

interface HomeSectionProps {
  children: React.ReactNode;
  variant?: "default" | "muted";
  className?: string;
  id?: string;
}

export function HomeSection({
  children,
  variant = "default",
  className,
  id,
}: HomeSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-20",
        variant === "muted" && "bg-neutral-100/80",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">{children}</div>
    </section>
  );
}
