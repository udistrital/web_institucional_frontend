export function VolumeSlider({ volume, onChange, className = '' }) {
  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Volumen"
      className={className}
    />
  );
}
