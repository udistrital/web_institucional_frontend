"use client";

import { useRadio } from "../Hooks/useRadio";
import { PlayButton } from "../PlayButton";
import { LiveBadge } from "../LiveBadge";
import { VolumeSlider } from "../VolumeSlider";
import Programacion from "../programacion";
import styles from "../emisoraLive.module.css";
import type { EmisoraLiveProps } from "./EmisoraLive.types";

const RADIO_URL = "https://listas.udistrital.edu.co:8443/laud";

export default function EmisoraLive({ className }: EmisoraLiveProps) {
  const {
    isPlaying,
    isLoading,
    hasError,
    volume,
    isMuted,
    togglePlay,
    toggleMute,
    changeVolume,
  } = useRadio(RADIO_URL);

  const rootClassName = [styles.Emisora, className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      <PlayButton
        isPlaying={isPlaying}
        isLoading={isLoading}
        onToggle={togglePlay}
        className="bg-amber-500 text-black hover:bg-amber-400"
      />
      <div className={styles.Station}>
        <span className="font-bold text-white">LA UD 90.4FM</span>
        <LiveBadge isPlaying={isPlaying} />
        {isLoading && (
          <span role="status" className="text-xs text-white/80">
            Cargando transmisión…
          </span>
        )}
        {hasError && (
          <span role="alert" className="text-xs font-semibold text-white">
            No se pudo reproducir la transmisión. Intenta de nuevo.
          </span>
        )}
      </div>

      <div className={styles.VolumeSlider}>
        <VolumeSlider
          volume={volume}
          isMuted={isMuted}
          onChange={changeVolume}
          onToggleMute={toggleMute}
          className="accent-amber-500"
        />
      </div>
      <div className={`${styles.Programacion} font-bold text-white`}>
        <Programacion />
      </div>
    </div>
  );
}
