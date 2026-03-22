import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export function getContent(contentPath: string): string | null {
  try {
    const fullPath = path.join(CONTENT_DIR, contentPath);
    return fs.readFileSync(fullPath, "utf-8");
  } catch {
    return null;
  }
}
