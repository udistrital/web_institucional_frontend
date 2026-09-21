'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export function useRadio(streamUrl: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      setIsLoading(true);
      audio.src = streamUrl;
      audio.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isPlaying, streamUrl]);

  const changeVolume = useCallback((val: string | number) => {
    const v = Math.max(0, Math.min(1, Number(val)));
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return { isPlaying, isLoading, volume, togglePlay, changeVolume };
}