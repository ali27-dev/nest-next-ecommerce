export interface Banner {
  id: string;
  imageUrl: string;
  title: string | null;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
  categoryId: string | null;
}
