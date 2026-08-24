// Coming soon: replace these gradients with real campaign photography per category.
export const categoryThemes: Record<
  string,
  { gradient: string; tagline: string }
> = {
  women: {
    gradient: "from-rose-200 via-orange-100 to-amber-100",
    tagline: "New arrivals for her",
  },
  men: {
    gradient: "from-slate-300 via-stone-200 to-neutral-200",
    tagline: "Sharp looks, every day",
  },
  kids: {
    gradient: "from-emerald-200 via-teal-100 to-cyan-100",
    tagline: "Playful styles for little ones",
  },
  watches: {
    gradient: "from-amber-200 via-yellow-100 to-orange-100",
    tagline: "Timeless pieces",
  },
  shoes: {
    gradient: "from-sky-200 via-cyan-100 to-blue-100",
    tagline: "Step out in style",
  },
  perfumes: {
    gradient: "from-fuchsia-200 via-pink-100 to-rose-100",
    tagline: "Signature scents",
  },
};

export const defaultTheme = {
  gradient: "from-muted via-background to-muted",
  tagline: "Shop the collection",
};

export function getCategoryTheme(slug: string) {
  return categoryThemes[slug] ?? defaultTheme;
}
