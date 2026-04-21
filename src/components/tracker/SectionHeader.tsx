export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-border/60" />
      <h1 className="tracker-heading text-center text-2xl sm:text-[1.625rem]">
        {title}
      </h1>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}
