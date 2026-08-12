import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/lib/nav-links";

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Your Order", href: "/account/orders" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "FAQs", href: "/faqs" },
];

const paymentMethods = ["Cash on Delivery", "EasyPaisa", "Bank Transfer"];

export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-16">
      <div className="px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Farzara Store
            </Link>
            <p className="mt-3 text-md text-muted-foreground max-w-xs">
              Menswear, womenswear, watches, shoes, and perfumes — crafted for
              everyday wear.
            </p>
            <div className="flex items-center gap-4 mt-5 text-muted-foreground">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-foreground"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-foreground"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>

              <a
                href="https://wa.me/923000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-foreground"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop column - reuses the same categories as the header nav */}
          <div>
            <h3 className="text-md font-semibold mb-4">Shop</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-md text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="text-md font-semibold mb-4">Support</h3>
            <ul className="flex flex-col gap-1.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-md text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <h3 className="text-md font-semibold mb-4">Stay in the loop</h3>
            <p className="text-md text-muted-foreground mb-3">
              New arrivals and offers, straight to your inbox.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-10"
              />
              <Button type="submit" className="h-10 shrink-0">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Newsletter signup — coming soon.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Farzara Store. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {paymentMethods.map((method, i) => (
              <span key={method} className="flex items-center gap-3">
                {method}
                {i < paymentMethods.length - 1 && (
                  <span aria-hidden="true">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
