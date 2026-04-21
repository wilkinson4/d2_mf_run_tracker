import type { ReactNode } from "react";

export function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-border/60" />
      <h1 className="tracker-heading flex items-center gap-2 text-center text-2xl sm:text-[1.625rem]">
        {icon}
        {title}
      </h1>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}
