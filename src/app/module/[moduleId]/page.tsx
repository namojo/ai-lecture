import { modules } from "@/data/curriculum";
import ModuleContent from "./module-content";

export function generateStaticParams() {
  return modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  return <ModuleContent moduleId={moduleId} />;
}
