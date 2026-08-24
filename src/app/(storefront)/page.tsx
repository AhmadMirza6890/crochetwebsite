import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getHomeSections, type HomeSectionConfig } from "@/lib/actions/home-sections";
import { HeroSection } from "@/components/storefront/hero";
import { FeaturedCategories } from "@/components/storefront/featured-categories";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { NewsletterSection } from "@/components/storefront/newsletter";
import { ValueProposition } from "@/components/storefront/value-proposition";
import { TestimonialsSection } from "@/components/storefront/testimonials";

export const dynamic = "force-dynamic";

const SECTION_RENDERERS: Record<string, (data: { heroImage: string | null; categories: never; products: never }) => React.ReactNode> = {
  hero: ({ heroImage }) => <HeroSection heroImage={heroImage} />,
  values: () => <ValueProposition />,
  categories: ({ categories }) => <FeaturedCategories categories={categories} />,
  products: ({ products }) => <FeaturedProducts products={products} />,
  testimonials: () => <TestimonialsSection />,
  newsletter: () => <NewsletterSection />,
};

export default async function HomePage() {
  const [featuredResult, categories, sectionConfig] = await Promise.all([
    getProducts({ limit: 8, isFeatured: true, isPublished: true }),
    getCategories({ isActive: true, withCount: true }),
    getHomeSections(),
  ]);

  // If no featured products, get newest published ones
  const productsResult =
    featuredResult.products.length > 0
      ? featuredResult
      : await getProducts({ limit: 8, isPublished: true, sort: "newest" });

  const heroImage = productsResult.products[0]?.images?.[0]?.url ?? null;

  // Fallback to full default layout if config missing/errored
  const activeSections: HomeSectionConfig[] =
    sectionConfig.length > 0
      ? [...sectionConfig].filter((s) => s.active).sort((a, b) => a.order - b.order)
      : DEFAULT_LAYOUT.map((key, order) => ({ id: key, key, name: key, active: true, order }));

  return (
    <>
      {activeSections.map((section) => {
        const render = SECTION_RENDERERS[section.key];
        if (!render) return null;
        return (
          <div key={section.key}>
            {render({ heroImage, categories: categories as never, products: productsResult.products as never })}
          </div>
        );
      })}
    </>
  );
}

const DEFAULT_LAYOUT = ["hero", "values", "categories", "products", "testimonials", "newsletter"];
