import { MorphIcon } from 'morphicons/react';
import { Volume2, VolumeX } from 'lucide';
import styles from './emisoraLive.module.css';

export function VolumeSlider({
  volume,
  isMuted,
  onChange,
  onToggleMute,
  className = '',
}) {
  return (
    <div className={styles.VolumeControl}>
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        aria-pressed={isMuted}
        className={`${styles.MuteButton} text-white transition hover:text-amber-400`}
      >
        <MorphIcon
          icon={isMuted ? VolumeX : Volume2}
          size={20}
        />
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Volumen"
        className={`${styles.Range} ${className}`}
      />
    </div>
  );
}
