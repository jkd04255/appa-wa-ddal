import { Suspense } from "react";
import { DiscoveryContent } from "@/components/daughter/discovery-content";
import { StaticDiscoveryRoute } from "@/components/static-route-clients";
import "../../editorial.css";

export default async function DaughterDiscoverPage({ searchParams }: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  if (process.env.STATIC_DEMO === "1") {
    return <Suspense fallback={<DiscoveryContent />}><StaticDiscoveryRoute /></Suspense>;
  }
  return <DiscoveryContent query={(await searchParams).category} />;
}
