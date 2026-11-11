import { notFound } from "next/navigation";
import { PerspectiveDetail } from "@/components/perspectives/perspective-detail";
import { findSharedPerspective, SHARED_PERSPECTIVES } from "@/data/fixtures/shared-perspectives";
import "../../../perspectives.css";

export function generateStaticParams() {
  return SHARED_PERSPECTIVES.map(({ slug }) => ({ slug }));
}

export default async function DadPerspectiveDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findSharedPerspective(slug);
  if (!item) notFound();
  return <PerspectiveDetail space="dad" item={item} />;
}
