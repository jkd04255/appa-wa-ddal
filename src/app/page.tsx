import { RoleLanding } from "@/components/role-landing";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ choose?: string }>;
}) {
  const { choose } = await searchParams;
  return <RoleLanding chooseExplicitly={choose === "1"} />;
}
