import { MorphIcon } from "morphicons/react";
import { Play, Pause } from "lucide"; // datos de vectores, no componentes
import styles from './emisoraLive.module.css';

export function PlayButton({ isPlaying, isLoading, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-label={isPlaying ? 'Detener' : 'Reproducir'}
       className={`${styles.PlayButton} rounded-full p-3 transition disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <MorphIcon 
          icon={isPlaying ? Pause : Play} 
          size={20}
        />
      )}
    </button>
  );
}
