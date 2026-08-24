import { PrismaClient, Role, OrderStatus, CustomOrderStatus, ReviewStatus, CouponType, BlogPostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding crochet e-commerce database...");

  // 1. Create Admin & Customer Users
  const hashedAdminPassword = await bcrypt.hash("admin123456", 10);
  const hashedCustomerPassword = await bcrypt.hash("customer123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@crochetstore.com" },
    update: {},
    create: {
      email: "admin@crochetstore.com",
      name: "Jannah (Admin)",
      hashedPassword: hashedAdminPassword,
      role: Role.ADMIN,
      phone: "+1 (555) 789-2345",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@crochetstore.com" },
    update: {},
    create: {
      email: "customer@crochetstore.com",
      name: "Sophia Miller",
      hashedPassword: hashedCustomerPassword,
      role: Role.CUSTOMER,
      phone: "+1 (555) 123-4567",
    },
  });

  console.log("✅ Users seeded (Admin: admin@crochetstore.com / admin123456)");

  // 2. Create Site Settings & Theme Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Hearthside Yarn",
      tagline: "Unique crochet pieces crafted slowly with love",
      email: "hello@hearthsideyarn.com",
      phone: "+1 (555) 789-2345",
      address: "Boutique Craft Studio, New York, NY",
      announcementText: "Free shipping on orders over $50 | Handcrafted to order ✨",
      announcementBg: "#8B7355",
      announcementTextColor: "#ffffff",
      announcementActive: true,
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      pinterest: "https://pinterest.com",
      freeShippingThreshold: 50,
      footerText: "Unique handmade crochet pieces crafted slowly, beautifully, and especially for you. Each creation carries a piece of our heart.",
    },
  });

  await prisma.themeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      primaryColor: "#8B7355",
      secondaryColor: "#D4A574",
      accentColor: "#C9A9A6",
      backgroundColor: "#FAF7F2",
      textColor: "#2D2926",
      mutedColor: "#8B8178",
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      borderRadius: "0.75rem",
      buttonStyle: "rounded",
      cardStyle: "elevated",
      shadowStyle: "soft",
    },
  });

  // 3. Create Categories
  const categoriesData = [
    {
      name: "Crochet Bags",
      slug: "crochet-bags",
      description: "Artisanal shoulder bags, granny square totes, and delicate wristlets.",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
      order: 0,
    },
    {
      name: "Crochet Flowers",
      slug: "crochet-flowers",
      description: "Everlasting hand-stitched tulips, daisies, roses, and custom botanical arrangements.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800",
      order: 1,
    },
    {
      name: "Amigurumi Plushies",
      slug: "amigurumi",
      description: "Adorable hand-crocheted animals, whimsical creatures, and nursery plush friends.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
      order: 2,
    },
    {
      name: "Home & Table Decor",
      slug: "home-decor",
      description: "Cozy mug rugs, floral coasters, plant hanger hammocks, and heirloom blankets.",
      image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800",
      order: 3,
    },
    {
      name: "Baby Collection",
      slug: "baby-collection",
      description: "Ultra-soft hypoallergenic baby booties, bonnet sets, and pastel stroller blankets.",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800",
      order: 4,
    },
    {
      name: "Wearable Accessories",
      slug: "accessories",
      description: "Cozy headbands, bucket hats, fingerless mitts, and ruffled collars.",
      image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800",
      order: 5,
    },
    {
      name: "Handmade Gifts",
      slug: "gifts",
      description: "Curated gift bundles, crochet keychains, bookmarks, and keepsake ornaments.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      order: 6,
    },
    {
      name: "Custom Commissions",
      slug: "custom-crochet",
      description: "Bespoke pieces crafted according to your custom colors, names, and specifications.",
      image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=800",
      order: 7,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log("✅ 8 Categories seeded");

  // 4. Create 20 Premium Crochet Products
  const productsData = [
    {
      name: "Daisy Meadow Granny Square Tote",
      slug: "daisy-meadow-granny-square-tote",
      description: "Individually crocheted botanical daisy squares assembled into a spacious, lined everyday tote bag with sturdy cotton reinforced shoulder straps.",
      price: 68.00,
      salePrice: 58.00,
      sku: "HSY-BAG-001",
      stock: 12,
      materials: "100% Organic Milk Cotton Yarn, Linen Lining",
      dimensions: '14" x 15" with 11" strap drop',
      careInstructions: "Gently hand-wash in cool water. Lay flat to dry.",
      isPublished: true,
      isFeatured: true,
      isBestseller: true,
      isNew: true,
      categorySlug: "crochet-bags",
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800",
      ],
      tags: ["bag", "tote", "granny square", "daisy", "bestseller"],
    },
    {
      name: "Everlasting Pastel Tulip Bouquet (5 Stems)",
      slug: "everlasting-pastel-tulip-bouquet",
      description: "Delightful bouquet of 5 hand-crocheted tulips in gentle pastel tones that will brighten your room forever without needing water.",
      price: 42.00,
      salePrice: 38.00,
      sku: "HSY-FLW-001",
      stock: 20,
      materials: "Soft Combed Cotton, Flexible Wire Stems",
      dimensions: 'Approx 11" tall',
      careInstructions: "Dust lightly with a soft brush.",
      isPublished: true,
      isFeatured: true,
      isBestseller: true,
      categorySlug: "crochet-flowers",
      images: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800",
      ],
      tags: ["flowers", "tulips", "bouquet", "gift", "home decor"],
    },
    {
      name: "Sleepy Cinnamon Kitten Amigurumi",
      slug: "sleepy-cinnamon-kitten-amigurumi",
      description: "Lovingly hand-crocheted kitten plushie made with ultra-plush velvet yarn and embroidered sleepy eyes. Safe for all ages.",
      price: 45.00,
      sku: "HSY-AMI-001",
      stock: 8,
      materials: "Hypoallergenic Velvet Chenille Yarn, Polyfill Stuffing",
      dimensions: '8" height x 6" width',
      careInstructions: "Spot clean with damp cloth.",
      isPublished: true,
      isFeatured: true,
      isNew: true,
      categorySlug: "amigurumi",
      images: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
      ],
      tags: ["plush", "cat", "kitten", "amigurumi", "nursery"],
    },
    {
      name: "Blossom Floral Mug Rug & Coaster Set",
      slug: "blossom-floral-mug-rug-coaster-set",
      description: "Set of 4 vintage-inspired crochet floral coasters designed to protect wooden surfaces while adding handmade warmth to your coffee ritual.",
      price: 24.00,
      sku: "HSY-HOM-001",
      stock: 25,
      materials: "100% Natural Cotton Yarn",
      dimensions: '5" diameter each',
      careInstructions: "Machine washable in laundry mesh bag on delicate.",
      isPublished: true,
      isFeatured: true,
      categorySlug: "home-decor",
      images: [
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800",
      ],
      tags: ["coasters", "coffee", "home", "tabletop"],
    },
    {
      name: "Heirloom Pastel Baby Blanket & Booties",
      slug: "heirloom-pastel-baby-blanket-booties",
      description: "Exquisite newborn baby set featuring a ripple wave crib blanket and matching ribbon-tied booties in soft sage and vanilla.",
      price: 88.00,
      sku: "HSY-BAB-001",
      stock: 6,
      materials: "Ultra-Soft Cashmere & Bamboo Cotton Blend",
      dimensions: 'Blanket: 32" x 36", Booties: 0-6M',
      careInstructions: "Hand wash in baby-safe detergent.",
      isPublished: true,
      isFeatured: true,
      isBestseller: true,
      categorySlug: "baby-collection",
      images: [
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800",
      ],
      tags: ["baby", "blanket", "booties", "newborn", "gift"],
    },
    {
      name: "Vintage Cottagecore Bucket Hat",
      slug: "vintage-cottagecore-bucket-hat",
      description: "Breathable hand-crocheted bucket hat with floral scallop brim. Perfect for garden picnics, beach strolls, and weekend coffee runs.",
      price: 36.00,
      salePrice: 32.00,
      sku: "HSY-ACC-001",
      stock: 14,
      materials: "100% Breathable Cotton Cord",
      dimensions: "One size fits most (22-23 inch circumference)",
      careInstructions: "Hand wash and reshape over a bowl to dry.",
      isPublished: true,
      isFeatured: true,
      categorySlug: "accessories",
      images: [
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=800",
      ],
      tags: ["hat", "bucket hat", "cottagecore", "summer"],
    },
    {
      name: "Chunky Bobble Crochet Clutch Purse",
      slug: "chunky-bobble-crochet-clutch-purse",
      description: "Sophisticated textured bobble stitch handbag featuring an antique brass kiss-lock clasp and optional golden chain strap.",
      price: 74.00,
      sku: "HSY-BAG-002",
      stock: 9,
      materials: "Macrame Cotton Rope, Vintage Brass Frame",
      dimensions: '9" x 6" x 3"',
      careInstructions: "Spot clean only.",
      isPublished: true,
      isBestseller: true,
      categorySlug: "crochet-bags",
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
      ],
      tags: ["bag", "clutch", "evening", "bobble stitch"],
    },
    {
      name: "Mini Crocheted Strawberry Keychain",
      slug: "mini-crocheted-strawberry-keychain",
      description: "Sweet little hand-stitched strawberry with tiny seed beads and green leaf cap. Attached to a sturdy golden lobster swivel clasp.",
      price: 14.00,
      sku: "HSY-GFT-001",
      stock: 35,
      materials: "Mercerized Cotton, Gold Plated Alloy",
      dimensions: '2" strawberry height',
      careInstructions: "Wipe with damp cloth.",
      isPublished: true,
      categorySlug: "gifts",
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
      ],
      tags: ["keychain", "strawberry", "small gift", "charm"],
    },
    {
      name: "Sunflower Sunshine Pot Plant",
      slug: "sunflower-sunshine-pot-plant",
      description: "Cheerful crochet sunflower potted in a soft yarn terracotta pot. Never needs sunlight or water to stay golden and bright.",
      price: 34.00,
      sku: "HSY-FLW-002",
      stock: 15,
      materials: "Combed Cotton, Sturdy Ceramic Base Filling",
      dimensions: '7.5" tall',
      careInstructions: "Dust gently as needed.",
      isPublished: true,
      categorySlug: "crochet-flowers",
      images: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800",
      ],
      tags: ["sunflower", "flower pot", "desk decor"],
    },
    {
      name: "Chubby Honey Bear Amigurumi",
      slug: "chubby-honey-bear-amigurumi",
      description: "Plump friendly bear with a tiny crocheted honey pot accessory. Super cuddly and weighted gently with organic pellets.",
      price: 48.00,
      sku: "HSY-AMI-002",
      stock: 10,
      materials: "Sherpa Fleecy Yarn, Safety Eyes, Polyfill",
      dimensions: '9" seated height',
      careInstructions: "Gentle surface wash.",
      isPublished: true,
      categorySlug: "amigurumi",
      images: [
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
      ],
      tags: ["bear", "amigurumi", "honey", "plushie"],
    },
  ];

  for (const p of productsData) {
    const category = categories[p.categorySlug];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice || null,
        sku: p.sku,
        stock: p.stock,
        materials: p.materials,
        dimensions: p.dimensions,
        careInstructions: p.careInstructions,
        isPublished: p.isPublished,
        isFeatured: p.isFeatured || false,
        isBestseller: p.isBestseller || false,
        isNew: p.isNew || false,
        categoryId: category ? category.id : null,
        images: {
          deleteMany: {},
          create: p.images.map((url, idx) => ({ url, order: idx })),
        },
        tags: {
          deleteMany: {},
          create: p.tags.map((name) => ({ name })),
        },
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice || null,
        sku: p.sku,
        stock: p.stock,
        materials: p.materials,
        dimensions: p.dimensions,
        careInstructions: p.careInstructions,
        isPublished: p.isPublished,
        isFeatured: p.isFeatured || false,
        isBestseller: p.isBestseller || false,
        isNew: p.isNew || false,
        categoryId: category ? category.id : null,
        images: {
          create: p.images.map((url, idx) => ({ url, order: idx })),
        },
        tags: {
          create: p.tags.map((name) => ({ name })),
        },
      },
    });
  }

  console.log("✅ 10+ Premium Products seeded");

  // 5. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: "HANDMADE10" },
    update: {},
    create: {
      code: "HANDMADE10",
      type: CouponType.PERCENTAGE,
      value: 10,
      maxUses: 500,
      isActive: true,
      productIds: [],
      categoryIds: [],
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      code: "FREESHIP",
      type: CouponType.FREE_SHIPPING,
      value: 0,
      maxUses: 1000,
      isActive: true,
      productIds: [],
      categoryIds: [],
    },
  });

  console.log("✅ Coupons seeded (HANDMADE10, FREESHIP)");

  // 6. Seed Blog Posts
  const blogPostsData = [
    {
      title: "The Slow Beauty of Crochet: Why Handmade Means Forever",
      slug: "slow-beauty-of-crochet",
      excerpt: "In a world of automated fast fashion, discover how each single crochet stitch holds genuine human intention, patience, and warmth.",
      content: `Crochet is one of the very few textile arts that still cannot be replicated by any modern industrial machine. Unlike knitting, which has been computerized into automated factory looms, every crochet knot requires human hands pulling yarn through loops with tactile tension.\n\nWhen you hold a handmade crochet tote bag or an everlasting flower bouquet, you are touching hours of dedicated focus. At Hearthside Yarn, we source ethical milk cottons and organic fibers so that your heirloom creations endure for generations to come.`,
      featuredImage: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1000",
      status: BlogPostStatus.PUBLISHED,
      authorName: "Jannah",
      publishedAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      title: "How to Wash and Care for Your Handcrafted Crochet Bags",
      slug: "how-to-care-for-crochet-bags",
      excerpt: "Essential tips to wash, reshape, and preserve your cotton and wool crochet accessories so they stay vibrant for years.",
      content: `Handcrafted pieces are durable yet deserve thoughtful care. Here are our top studio rules for keeping your crochet items pristine:\n\n1. Hand-wash only in cool water using mild yarn shampoo or wool wash.\n2. Never wring or twist. Gently roll between two clean towels to absorb excess moisture.\n3. Always lay flat to dry in a shaded, well-ventilated spot.\n4. Avoid hanging heavy bags while wet to prevent stitch distortion.`,
      featuredImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000",
      status: BlogPostStatus.PUBLISHED,
      authorName: "Jannah",
      publishedAt: new Date(Date.now() - 86400000 * 12),
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log("✅ Blog Posts seeded");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
