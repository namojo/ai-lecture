import { modules, getChapter } from "@/data/curriculum";
import { getContent } from "@/data/content-loader";
import ChapterContent from "./chapter-content";

export function generateStaticParams() {
  return modules.flatMap((m) =>
    m.chapters.map((c) => ({ moduleId: m.id, chapterId: c.id }))
  );
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ moduleId: string; chapterId: string }>;
}) {
  const { moduleId, chapterId } = await params;
  const chapter = getChapter(moduleId, chapterId);
  const markdown = chapter ? getContent(chapter.contentPath) : null;

  return (
    <ChapterContent
      moduleId={moduleId}
      chapterId={chapterId}
      markdown={markdown}
    />
  );
}
