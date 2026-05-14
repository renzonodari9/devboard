export default function TaskCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#171717] border border-[#262626] rounded-xl animate-pulse">
      <div className="w-6 h-6 rounded-full border-2 border-[#404040]" />
      <div className="flex-1">
        <div className="h-5 w-1/2 bg-[#404040] rounded mb-2" />
        <div className="h-4 w-24 bg-[#404040] rounded" />
      </div>
    </div>
  );
}