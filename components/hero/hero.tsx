import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle?: string;
  backGroundImage: string;

  //Optional Props
  primaryButton?: {
    text: string;
    href: string;
  };
  secundaryButton?: {
    text: string;
    href: string;
  };
  height?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
}

export default function Hero({
  title,
  subtitle,
  backGroundImage,
  primaryButton,
  secundaryButton,
  height = "medium",
  alignment = "left",
}: HeroProps) {
  const heightClases = {
    small: "py-20",
    medium: "py-32",
    large: "py-48",
  };

  const aligmentClases = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <section
      className={`relative flex-col justify-center ${heightClases[height]} px-6 text-white overflow-hidden`}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={backGroundImage}
          alt={title}
          fill
          priority
          className="object-cover object-center brightness-50"
        />
      </div>
      <div
        className={`max-w-4xl mx-auto flex flex-col z-10 ${aligmentClases[alignment]}`}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow">
            {subtitle}
          </p>
        )}
        {(primaryButton || secundaryButton) && (
          <div className="flex flex-wrap gap-4 mt-2">
            {primaryButton && (
              <Link
                href={primaryButton.href}
                className="bg-[#8c1919] hover:bg-[#fdb400] hover:text-black border border-white text-white font-extrabold px-6 py-3 rounded-lg transition text-2xl"
              >
                {primaryButton.text}
              </Link>
            )}
            {secundaryButton && (
              <Link
                href={secundaryButton.href}
                className="bg-[#8c1919] hover:bg-[#fdb400] hover:text-black border border-white text-white font-extrabold px-6 py-3 rounded-lg transition text-2xl"
              >
                {secundaryButton.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
