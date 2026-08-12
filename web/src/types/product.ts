/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Key } from "readline";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
  href: Key | null | undefined;
  label: ReactNode;
  id: string;
  name: string;
  slug: string;
}

export interface Fabric {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  sizes: any;
  galleryImages: any;
  compareAtPrice: boolean;
  color: any;
  secondaryImageUrl: any;
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  season: "SUMMER" | "WINTER" | "ALL_SEASON" | null;
  pieceCount: "ONE_PIECE" | "TWO_PIECE" | "THREE_PIECE" | null;
  fabricId: string | null;
  categoryId: string;
  category?: Category;
  fabric?: Fabric;
  stitchType: string;
}

export interface ProductListResponse {
  products: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
