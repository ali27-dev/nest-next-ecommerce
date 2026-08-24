import type { Metadata } from "next";
import { InfoPageLayout, InfoCard } from "@/components/info/info-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Farzara Store",
  description: "How Farzara Store collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="Last updated: August 2026"
    >
      <InfoCard title="Information we collect">
        <p>
          When you create an account or place an order, we collect your name,
          email address, phone number, and shipping address. Payment details for
          EasyPaisa or bank transfers are used only to verify your transaction.
        </p>
      </InfoCard>

      <InfoCard title="How we use your information">
        <p>
          We use your data to process orders, communicate about your purchases,
          improve our services, and respond to support requests. We do not sell
          your personal information to third parties.
        </p>
      </InfoCard>

      <InfoCard title="Data security">
        <p>
          We take reasonable measures to protect your information. Passwords are
          stored securely, and access to customer data is limited to authorized
          personnel.
        </p>
      </InfoCard>

      <InfoCard title="Your rights">
        <p>
          You may request access to or correction of your personal data by
          contacting us at support@farzarastore.com. You can delete your account
          by reaching out to our support team.
        </p>
      </InfoCard>
    </InfoPageLayout>
  );
}
