export default function StatCardSkeleton() {
  return (
    <div className="p-6 bg-[#171717] border border-[#262626] rounded-2xl animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-[#262626] rounded-xl" />
      </div>
      <div className="h-4 w-20 bg-[#262626] rounded" />
      <div className="h-8 w-16 bg-[#262626] rounded mt-2" />
    </div>
  );
}