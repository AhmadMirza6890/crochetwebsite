import { getMedia } from "@/lib/actions/media";
import { MediaManager } from "./media-manager";

export const metadata = { title: "Media Library | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const mediaItems = await getMedia();
  return <MediaManager initialItems={mediaItems} />;
}
