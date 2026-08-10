import type { Metadata } from "next";
import { Geist_Mono, Outfit, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header/header";
import { Sidebar } from "@/components/layout/header/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { Footer } from "@/components/layout/footer/footer";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        outfit.variable,
        ralewayHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
