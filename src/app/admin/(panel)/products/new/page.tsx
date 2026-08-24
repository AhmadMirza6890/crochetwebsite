import { getCategories } from "@/lib/actions/categories";
import { ProductForm } from "../product-form";

export const metadata = { title: "New Product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductForm categories={categories} />;
}
