export function VolumeSlider({ volume, onChange, className = '' }) {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={volume}
      onChange={(e) => onChange(e.target.value)}
      className={`h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer ${className}`}
      aria-label="Volumen"
    />
  );
}