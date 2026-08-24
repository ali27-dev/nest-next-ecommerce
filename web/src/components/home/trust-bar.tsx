import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast shipping across Pakistan",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "COD, EasyPaisa & bank transfer",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free exchange policy",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "We're here to help anytime",
  },
];

export function TrustBar() {
  return (
    <div className="border-y border-border/60 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm">
                <Icon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
