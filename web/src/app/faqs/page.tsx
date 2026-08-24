import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/info/info-page-layout";
import { FaqAccordion } from "@/components/info/faq-accordion";
import { faqItems } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "FAQs | Farzara Store",
  description: "Frequently asked questions about orders, payments, delivery, and returns.",
};

export default function FaqsPage() {
  return (
    <InfoPageLayout
      title="FAQs"
      subtitle="Quick answers to the most common questions about shopping at Farzara Store."
    >
      <FaqAccordion items={faqItems} />
    </InfoPageLayout>
  );
}
