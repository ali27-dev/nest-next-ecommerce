import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { InfoPageLayout, InfoCard } from "@/components/info/info-page-layout";
import { contactInfo } from "@/lib/site-content";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us | Farzara Store",
  description: "Get in touch with Farzara Store customer support.",
};

export default function ContactPage() {
  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="We're here to help with orders, sizing, payments, and anything else you need."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-start gap-3 rounded-2xl border bg-background p-4 md:p-5 shadow-sm hover:border-foreground/20 transition-colors"
        >
          <Mail className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-sm text-muted-foreground mt-1">{contactInfo.email}</p>
          </div>
        </a>
        <a
          href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
          className="flex items-start gap-3 rounded-2xl border bg-background p-4 md:p-5 shadow-sm hover:border-foreground/20 transition-colors"
        >
          <Phone className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Phone</p>
            <p className="text-sm text-muted-foreground mt-1">{contactInfo.phone}</p>
          </div>
        </a>
        <a
          href={`https://wa.me/${contactInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-2xl border bg-background p-4 md:p-5 shadow-sm hover:border-foreground/20 transition-colors"
        >
          <MessageCircle className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-sm text-muted-foreground mt-1">Chat with us directly</p>
          </div>
        </a>
        <div className="flex items-start gap-3 rounded-2xl border bg-background p-4 md:p-5 shadow-sm">
          <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Location</p>
            <p className="text-sm text-muted-foreground mt-1">{contactInfo.address}</p>
          </div>
        </div>
      </div>

      <InfoCard title="Business hours">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{contactInfo.hours}</span>
        </div>
      </InfoCard>

      <div className="rounded-2xl border bg-background p-5 md:p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground mb-4">
          Already have an account? Open a support ticket for order-specific help.
        </p>
        <Button asChild className="h-11 px-6 rounded-full">
          <Link href="/support">Go to Support</Link>
        </Button>
      </div>
    </InfoPageLayout>
  );
}
