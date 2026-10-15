'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide';
import { MorphIcon } from 'morphicons/react';
import styles from './emisoraLive.module.css';

export function LiveBadge({ isPlaying, label = 'EN VIVO' }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div className={`relative ${styles.LiveBadge}`}>
      <span className={styles.Badge}>
        <span className={`w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : 'opacity-30'}`} />
        {label}
      </span>

      <button
        type="button"
        onClick={copyPageLink}
        aria-label={isCopied ? 'Enlace copiado' : 'Copiar enlace de la página'}
        title={isCopied ? 'Enlace copiado' : 'Copiar enlace de la página'}
         className={`${styles.ShareButton} text-white transition hover:text-amber-400`}
      >
        <MorphIcon icon={isCopied ? Check : Share2} size={18} />
      </button>

      {isCopied && (
        <span
          role="status"
          className={styles.CopyMessage}
        >
          Link copiado
        </span>
      )}
    </div>
  );
}
