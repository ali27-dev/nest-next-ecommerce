import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { MessageCircle, Mail, Phone, Truck, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { contactInfo } from "@/lib/site-content";
import type { Category } from "@/types/product";

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Your Order", href: "/orders" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "FAQs", href: "/faqs" },
  { label: "Help Center", href: "/support" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const paymentMethods = ["Cash on Delivery", "EasyPaisa", "Bank Transfer"];

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ categories }: { categories: Category[] }) {
  const shopLinks = categories.map((c) => ({
    label: c.name,
    href: `/category/${c.id}`,
  }));

  return (
    <footer className="w-full border-t bg-neutral-50 mt-0">
      {/* Reassurance strip */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <p className="flex items-center justify-center sm:justify-start gap-2">
            <Truck className="h-4 w-4 shrink-0" /> Delivery across Pakistan
          </p>
          <p className="flex items-center justify-center sm:justify-end gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" /> Cash on Delivery
            available
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10">
          {/* Brand - full width on mobile */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="font-heading text-2xl font-semibold tracking-tight">
              Farzara Store
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Menswear, womenswear, watches, shoes, and perfumes — crafted for
              everyday wear.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {contactInfo.phone}
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-5">
              {[
                { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
                { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
                {
                  href: `https://wa.me/${contactInfo.whatsapp}`,
                  label: "WhatsApp",
                  Icon: MessageCircle,
                },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList title="Shop" links={shopLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList title="Support" links={supportLinks} />
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <FooterLinkList title="Company" links={companyLinks} />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-background p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground mt-1">
              New arrivals and offers, straight to your inbox.
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-11"
              />
              <Button type="submit" className="h-11 shrink-0 px-6">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Newsletter signup — coming soon.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Farzara Store. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
