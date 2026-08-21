"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import { Category } from "@/types/product";

export function SiteChrome({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header categories={categories} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer categories={categories} />}
    </>
  );
}
