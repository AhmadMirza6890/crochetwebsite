import { revalidatePath } from "next/cache";

export function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/custom-order");
}
