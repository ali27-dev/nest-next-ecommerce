import type { Metadata } from "next";
import { InfoPageLayout, InfoCard } from "@/components/info/info-page-layout";
import { aboutContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "About Us | Farzara Store",
  description: "Learn about Farzara Store — fashion for everyday life in Pakistan.",
};

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Farzara Store"
      subtitle={aboutContent.intro}
    >
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {aboutContent.values.map((value) => (
          <InfoCard key={value.title} title={value.title}>
            <p>{value.description}</p>
          </InfoCard>
        ))}
      </div>
    </InfoPageLayout>
  );
}
