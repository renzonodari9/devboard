export default function ProjectCardSkeleton() {
  return (
    <div className="p-5 bg-[#171717] border border-[#262626] rounded-2xl animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#404040]" />
          <div className="h-5 w-32 bg-[#404040] rounded" />
        </div>
      </div>
      <div className="h-4 w-3/4 bg-[#404040] rounded mb-2" />
      <div className="h-4 w-1/2 bg-[#404040] rounded" />
      <div className="mt-4 flex items-center gap-2">
        <div className="h-5 w-16 bg-[#404040] rounded-full" />
      </div>
    </div>
  );
}