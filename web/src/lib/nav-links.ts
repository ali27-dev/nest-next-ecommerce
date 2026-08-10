import type { LucideIcon } from "lucide-react";
import {
  User,
  Shirt,
  Baby,
  Watch,
  Footprints,
  SprayCan,
  Tag,
} from "lucide-react";

export interface SubLink {
  label: string;
  href: string;
}

export interface NavCategory {
  label: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  subLinks?: SubLink[];
}

export const categories: NavCategory[] = [
  {
    label: "Men",
    href: "/category/men",
    icon: User,
    subLinks: [
      { label: "Shop All", href: "/category/men" },
      { label: "New Arrivals", href: "/category/men?sort=new" },
      { label: "Best Sellers", href: "/category/men?sort=popular" },
    ],
  },
  {
    label: "Women",
    href: "/category/women",
    icon: Shirt,
    subLinks: [
      { label: "Shop All", href: "/category/women" },
      { label: "New Arrivals", href: "/category/women?sort=new" },
      { label: "Best Sellers", href: "/category/women?sort=popular" },
    ],
  },
  {
    label: "Kids",
    href: "/category/kids",
    icon: Baby,
    subLinks: [{ label: "Shop All", href: "/category/kids" }],
  },
  { label: "Watches", href: "/category/watches", icon: Watch },
  { label: "Shoes", href: "/category/shoes", icon: Footprints },
  { label: "Perfumes", href: "/category/perfumes", icon: SprayCan },
  { label: "Sale", href: "/sale", icon: Tag, highlight: true },
];
