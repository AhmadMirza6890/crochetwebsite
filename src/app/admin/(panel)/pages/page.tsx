import { getHomeSections } from "@/lib/actions/home-sections";
import { SectionBuilder } from "./section-builder";

export const metadata = { title: "Homepage CMS | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPageBuilderPage() {
  const sections = await getHomeSections();
  return <SectionBuilder initialSections={sections} />;
}
