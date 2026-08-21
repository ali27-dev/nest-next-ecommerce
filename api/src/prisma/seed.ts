import { PrismaClient, Season, PieceCount, StitchType } from '@prisma/client';

const prisma = new PrismaClient();

function galleryFor(sku: string) {
  return [1, 2, 3, 4].map(
    (n) => `https://picsum.photos/seed/${sku}-${n}/600/800`,
  );
}

async function main() {
  await prisma.product.updateMany({
    where: { sku: 'IPHONE15-BLK-128' },
    data: { isActive: false },
  });
  await prisma.category.updateMany({
    where: { slug: 'electronics' },
    data: { isActive: false },
  });

  const categoryData = [
    { name: 'Women', slug: 'women' },
    { name: 'Men', slug: 'men' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Perfumes', slug: 'perfumes' },
  ];
  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = category.id;
  }

  const fabricData = [
    { name: 'Lawn', slug: 'lawn' },
    { name: 'Silk', slug: 'silk' },
    { name: 'Cotton', slug: 'cotton' },
    { name: 'Khaddar', slug: 'khaddar' },
    { name: 'Leather', slug: 'leather' },
    { name: 'Chiffon', slug: 'chiffon' },
  ];
  const fabrics: Record<string, string> = {};
  for (const f of fabricData) {
    const fabric = await prisma.fabric.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
    fabrics[f.slug] = fabric.id;
  }

  const products = [
    {
      name: 'Embroidered Lawn Kurta',
      sku: 'WMN-LAWN-EMB-01',
      price: 2899,
      compareAtPrice: 3499,
      stock: 24,
      category: 'women',
      fabric: 'lawn',
      season: Season.SUMMER,
      pieceCount: PieceCount.ONE_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Maroon',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Chiffon Party Dress',
      sku: 'WMN-CHF-DRS-02',
      price: 4599,
      compareAtPrice: null,
      stock: 12,
      category: 'women',
      fabric: 'chiffon',
      season: Season.ALL_SEASON,
      pieceCount: PieceCount.ONE_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Emerald',
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Silk Winter Shawl Set',
      sku: 'WMN-SLK-SET-03',
      price: 6999,
      compareAtPrice: 8499,
      stock: 8,
      category: 'women',
      fabric: 'silk',
      season: Season.WINTER,
      pieceCount: PieceCount.THREE_PIECE,
      stitchType: StitchType.UNSTITCHED,
      color: 'Navy',
      sizes: [],
    },

    {
      name: 'Khaddar Kurta Shalwar',
      sku: 'MEN-KHD-KRT-01',
      price: 3299,
      compareAtPrice: null,
      stock: 30,
      category: 'men',
      fabric: 'khaddar',
      season: Season.WINTER,
      pieceCount: PieceCount.TWO_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Black',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Cotton Casual Shirt',
      sku: 'MEN-CTN-SHT-02',
      price: 2199,
      compareAtPrice: 2599,
      stock: 40,
      category: 'men',
      fabric: 'cotton',
      season: Season.ALL_SEASON,
      pieceCount: PieceCount.ONE_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'White',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Wash & Wear Formal Suit',
      sku: 'MEN-WNW-SUT-03',
      price: 5899,
      compareAtPrice: 6899,
      stock: 15,
      category: 'men',
      fabric: 'cotton',
      season: Season.ALL_SEASON,
      pieceCount: PieceCount.TWO_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Charcoal',
      sizes: ['M', 'L', 'XL'],
    },

    {
      name: 'Kids Printed Cotton Set',
      sku: 'KID-CTN-SET-01',
      price: 1699,
      compareAtPrice: 1999,
      stock: 25,
      category: 'kids',
      fabric: 'cotton',
      season: Season.SUMMER,
      pieceCount: PieceCount.TWO_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Sky Blue',
      sizes: ['XS', 'S', 'M'],
    },
    {
      name: 'Kids Winter Fleece Jacket',
      sku: 'KID-FLC-JKT-02',
      price: 2399,
      compareAtPrice: null,
      stock: 18,
      category: 'kids',
      fabric: null,
      season: Season.WINTER,
      pieceCount: PieceCount.ONE_PIECE,
      stitchType: StitchType.STITCHED,
      color: 'Red',
      sizes: ['XS', 'S', 'M'],
    },

    {
      name: 'Classic Leather Strap Watch',
      sku: 'WCH-LTH-CLS-01',
      price: 4999,
      compareAtPrice: 5999,
      stock: 20,
      category: 'watches',
      fabric: 'leather',
      season: Season.ALL_SEASON,
      pieceCount: null,
      stitchType: null,
      color: 'Brown',
      sizes: [],
    },
    {
      name: 'Steel Chronograph Watch',
      sku: 'WCH-STL-CHR-02',
      price: 7499,
      compareAtPrice: null,
      stock: 10,
      category: 'watches',
      fabric: null,
      season: Season.ALL_SEASON,
      pieceCount: null,
      stitchType: null,
      color: 'Silver',
      sizes: [],
    },

    {
      name: 'Leather Formal Shoes',
      sku: 'SHO-LTH-FRM-01',
      price: 3799,
      compareAtPrice: 4499,
      stock: 22,
      category: 'shoes',
      fabric: 'leather',
      season: Season.ALL_SEASON,
      pieceCount: null,
      stitchType: null,
      color: 'Black',
      sizes: ['40', '41', '42', '43', '44'],
    },
    {
      name: 'Casual Canvas Sneakers',
      sku: 'SHO-CNV-SNK-02',
      price: 2599,
      compareAtPrice: null,
      stock: 35,
      category: 'shoes',
      fabric: null,
      season: Season.SUMMER,
      pieceCount: null,
      stitchType: null,
      color: 'White',
      sizes: ['39', '40', '41', '42', '43'],
    },

    {
      name: 'Farzara Signature Eau de Parfum',
      sku: 'PRF-SIG-EDP-01',
      price: 5499,
      compareAtPrice: 6499,
      stock: 16,
      category: 'perfumes',
      fabric: null,
      season: Season.ALL_SEASON,
      pieceCount: null,
      stitchType: null,
      color: null,
      sizes: ['50ml', '100ml'],
    },
    {
      name: 'Musk Oud Attar 12ml',
      sku: 'PRF-OUD-ATR-02',
      price: 2899,
      compareAtPrice: null,
      stock: 28,
      category: 'perfumes',
      fabric: null,
      season: Season.ALL_SEASON,
      pieceCount: null,
      stitchType: null,
      color: null,
      sizes: ['12ml'],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? undefined,
        stock: p.stock,
        isActive: true,
        categoryId: categories[p.category],
        fabricId: p.fabric ? fabrics[p.fabric] : undefined,
        season: p.season ?? undefined,
        pieceCount: p.pieceCount ?? undefined,
        stitchType: p.stitchType ?? undefined,
        color: p.color ?? undefined,
        sizes: p.sizes,
        imageUrl: `https://picsum.photos/seed/${p.sku}-front/600/800`,
        secondaryImageUrl: `https://picsum.photos/seed/${p.sku}-back/600/800`,
        galleryImages: galleryFor(p.sku),
      },
    });
  }

  console.log(
    `Seeded ${categoryData.length} categories, ${fabricData.length} fabrics, ${products.length} products.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
