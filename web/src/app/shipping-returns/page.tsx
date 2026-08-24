import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageLayout, InfoCard } from "@/components/info/info-page-layout";
import { shippingInfo } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Shipping & Returns | Farzara Store",
  description: "Delivery times, shipping policy, and return guidelines.",
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="text-foreground/40 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ShippingReturnsPage() {
  return (
    <InfoPageLayout
      title="Shipping & Returns"
      subtitle="Everything you need to know about delivery, cash on delivery, and our return policy."
    >
      <InfoCard title="Delivery">
        <BulletList items={shippingInfo.delivery} />
      </InfoCard>

      <InfoCard title="Cash on Delivery">
        <BulletList items={shippingInfo.cod} />
      </InfoCard>

      <InfoCard title="Returns & Exchanges">
        <BulletList items={shippingInfo.returns} />
      </InfoCard>

      <p className="text-center text-sm text-muted-foreground">
        Questions? See our{" "}
        <Link href="/faqs" className="underline underline-offset-4 hover:text-foreground">
          FAQs
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="underline underline-offset-4 hover:text-foreground">
          contact us
        </Link>
        .
      </p>
    </InfoPageLayout>
  );
}
