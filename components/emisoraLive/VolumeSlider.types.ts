export interface VolumeSliderProps {
  volume: number;
  onChange: (v: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  className?: string;
}
