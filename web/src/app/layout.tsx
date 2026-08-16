import type { Metadata } from "next";
import { Geist_Mono, Outfit, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header/header";
import { Sidebar } from "@/components/layout/header/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/layout/footer/footer";
import { Category } from "@/types/product";
import { apiFetch } from "@/lib/api";
import { CartProvider } from "@/contexts/cart-context";
import { QuickAddProvider } from "@/contexts/quick-add-context";
import { SiteChrome } from "@/components/layout/site-chrome";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farzara Store",
  description: "Menswear, womenswear, watches, shoes, and perfumes.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await apiFetch<Category[]>("/categories");

  return (
    <html lang="en" className={cn(/* unchanged */)}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <QuickAddProvider>
              <SiteChrome categories={categories}>{children}</SiteChrome>
            </QuickAddProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
