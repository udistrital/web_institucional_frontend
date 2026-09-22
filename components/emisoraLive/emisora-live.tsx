"use client";

import { useRadio } from "./Hooks/useRadio";
import { PlayButton } from "./PlayButton";
import { LiveBadge } from "./LiveBadge";
import { VolumeSlider } from "./VolumeSlider";
import Programacion from "./programacion";
import styles from "./emisoraLive.module.css";

const RADIO_URL = "https://listas.udistrital.edu.co:8443/laud";

export default function LiveEmisora() {
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    togglePlay,
    toggleMute,
    changeVolume,
  } = useRadio(RADIO_URL);

  return (
    <div className={`${styles.Emisora}`}>
      <PlayButton
        isPlaying={isPlaying}
        isLoading={isLoading}
        onClick={togglePlay}
        className="bg-amber-500 text-black hover:bg-amber-400"
      />
      <div className={styles.Station}>
        <span className="font-bold text-white">LA UD 90.4FM</span>
        <LiveBadge isPlaying={isPlaying} />
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
