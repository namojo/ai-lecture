import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border-color)] bg-[var(--surface)] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
