import type { Metadata } from "next";
import { InfoPageLayout, InfoCard } from "@/components/info/info-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Farzara Store",
  description: "Terms and conditions for using Farzara Store.",
};

export default function TermsPage() {
  return (
    <InfoPageLayout
      title="Terms of Service"
      subtitle="By using Farzara Store, you agree to the following terms."
    >
      <InfoCard title="Orders & pricing">
        <p>
          All prices are listed in Pakistani Rupees (PKR). We reserve the right
          to correct pricing errors and cancel orders placed at incorrect prices.
          An order is confirmed once you receive an order confirmation.
        </p>
      </InfoCard>

      <InfoCard title="Payments">
        <p>
          For EasyPaisa and bank transfer orders, processing begins after our
          team verifies your payment. Unverified payments may result in order
          cancellation after a reasonable period.
        </p>
      </InfoCard>

      <InfoCard title="Product availability">
        <p>
          Product images are for illustration. Colors may vary slightly due to
          screen settings. If an item is out of stock after you order, we will
          contact you to offer an alternative or full refund.
        </p>
      </InfoCard>

      <InfoCard title="Limitation of liability">
        <p>
          Farzara Store is not liable for indirect or consequential damages
          arising from use of our website or products, to the extent permitted
          by applicable law.
        </p>
      </InfoCard>
    </InfoPageLayout>
  );
}
