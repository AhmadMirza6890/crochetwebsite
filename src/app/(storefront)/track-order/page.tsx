import { TrackOrderClient } from "./track-order-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track Your Order",
  description: "Follow your Hearthside Yarn order from our studio to your doorstep.",
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const params = await searchParams;
  return <TrackOrderClient initialOrderNumber={params.orderNumber} />;
}
