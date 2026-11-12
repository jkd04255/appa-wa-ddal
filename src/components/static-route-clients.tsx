"use client";

import { useSearchParams } from "next/navigation";
import { RoleLanding } from "./role-landing";
import { DiscoveryContent } from "./daughter/discovery-content";

export function StaticLandingRoute() {
  const params = useSearchParams();
  return <RoleLanding chooseExplicitly={params.get("choose") === "1"} />;
}

export function StaticDiscoveryRoute() {
  const params = useSearchParams();
  const values = params.getAll("category");
  return <DiscoveryContent query={values.length > 1 ? values : values[0]} />;
}
