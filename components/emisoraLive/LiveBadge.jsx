export function LiveBadge({ isPlaying, label = 'EN VIVO' }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
      <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : 'opacity-30'}`} />
      {label}
    </span>
  );
}