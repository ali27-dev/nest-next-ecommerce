export interface Category {
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
  id: string;
  name: string;
  description: string | null;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  sku: string;
  imageUrl: string | null;
  secondaryImageUrl: string | null;
  galleryImages: string[];
  sizes: string[];
  color: string | null;
  isActive: boolean;
  season: "SUMMER" | "WINTER" | "ALL_SEASON" | null;
  pieceCount: "ONE_PIECE" | "TWO_PIECE" | "THREE_PIECE" | null;
  stitchType: "STITCHED" | "UNSTITCHED" | null;
  fabricId: string | null;
  categoryId: string;
  category?: Category;
  fabric?: Fabric;
}

export interface ProductListResponse {
  products: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
