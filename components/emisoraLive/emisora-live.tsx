'use client';

import { useRadio } from './Hooks/useRadio';
import { PlayButton } from './PlayButton';
import { LiveBadge } from './LiveBadge';
import { VolumeSlider } from './VolumeSlider';
import styles from "./emisoraLive.module.css";

const RADIO_URL = 'https://listas.udistrital.edu.co:8443/laud';

export default function LiveEmisora() {
  const { isPlaying, isLoading, volume, togglePlay, changeVolume } = useRadio(RADIO_URL);

  return (
    <div className={styles.Emisora}>
      <PlayButton
        isPlaying={isPlaying}
        isLoading={isLoading}
        onClick={togglePlay}
        className="bg-amber-500 text-black hover:bg-amber-400"
      />

      <div className="flex flex-col">
        <span className="text-sm font-medium">LAUD</span>
        <LiveBadge isPlaying={isPlaying} />
      </div>

      <VolumeSlider
        volume={volume}
        onChange={changeVolume}
        className="w-20 accent-amber-500 ml-auto"
      />
    </div>
  );
}