import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl p-5 border bg-muted"
          : "rounded-xl p-5 border bg-background"
      }
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
