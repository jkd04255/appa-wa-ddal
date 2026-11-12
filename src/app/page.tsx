import { Suspense } from "react";
import { StaticLandingRoute } from "@/components/static-route-clients";
import { RoleLanding } from "@/components/role-landing";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ choose?: string }>;
}) {
  if (process.env.STATIC_DEMO === "1") {
    return <Suspense fallback={<RoleLanding chooseExplicitly />}><StaticLandingRoute /></Suspense>;
  }
  const { choose } = await searchParams;
  return <RoleLanding chooseExplicitly={choose === "1"} />;
}

