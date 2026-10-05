import Image from 'next/image';
import Link from 'next/link';

interface InfoCardProps {
  iconSrc: string;
  iconAlt?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  imageContainerClassName?: string;
  imageClassName?: string;
  variant?: 'icon' | 'image';
}

export default function InfoCard({
  iconSrc,
  iconAlt = 'Icono',
  title,
  subtitle,
  buttonText,
  buttonHref,
  imageContainerClassName,
  imageClassName,
  variant = 'icon',
}: InfoCardProps) {
  if (variant === 'image') {
    return (
      <div className="flex flex-col sm:flex-row bg-[#2a1215] border border-[#8c1919]/60 hover:border-[#8c1919] rounded-lg overflow-hidden w-full transition-colors">
        {/* Izquierda: Imagen a todo lo alto desde el borde */}
        <div className="relative w-full h-44 sm:h-auto sm:w-72 lg:w-80 shrink-0">
          <Image
            src={iconSrc}
            alt={iconAlt}
            fill
            className="object-cover"
          />
        </div>
        {/* Contenido: Título, Subtítulo y Botón */}
        <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-6 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-bold text-lg sm:text-xl">{title}</h3>
            <p className="text-gray-300 text-sm sm:text-base">{subtitle}</p>
          </div>
          <div className="w-full sm:w-auto flex justify-end sm:justify-start">
            <Link
              href={buttonHref}
              className="text-[#ff5252] hover:text-[#ff7b7b] font-semibold text-sm sm:text-base transition-colors inline-flex items-center gap-1"
            >
              {buttonText} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#2a1215] border border-[#8c1919]/60 hover:border-[#8c1919] p-6 rounded-lg gap-6 w-full transition-colors">
      {/* Izquierda: Icono, Título y Subtítulo */}
      <div className="flex items-center gap-5">
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-[#8c1919]/40 bg-[#170a0b] flex items-center justify-center rounded ${imageContainerClassName ?? ''}`}
        >
          <Image
            src={iconSrc}
            alt={iconAlt}
            fill
            className={`object-contain p-2 ${imageClassName ?? ''}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-white font-bold text-lg sm:text-xl">{title}</h3>
          <p className="text-gray-300 text-sm sm:text-base">{subtitle}</p>
        </div>
      </div>

      {/* Derecha: Botón */}
      <div className="w-full sm:w-auto flex justify-end sm:justify-start">
        <Link
          href={buttonHref}
          className="text-[#ff5252] hover:text-[#ff7b7b] font-semibold text-sm sm:text-base transition-colors inline-flex items-center gap-1"
        >
          {buttonText} →
        </Link>
      </div>
    </div>
  );
}