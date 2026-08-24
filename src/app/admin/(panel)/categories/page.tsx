import { getCategories } from "@/lib/actions/categories";
import { CategoriesManager } from "./categories-manager";

export const metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ withCount: true });
  return <CategoriesManager categories={categories as never} />;
}
