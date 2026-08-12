import {
  User,
  Shirt,
  Baby,
  Watch,
  Footprints,
  SprayCan,
  Tag,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  men: User,
  women: Shirt,
  kids: Baby,
  watches: Watch,
  shoes: Footprints,
  perfumes: SprayCan,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return iconMap[slug] ?? Tag;
}
