import NewsCarousel from "./NewsCarousel";
import type { NewsItem } from "@/types/domain";

export type { NewsItem };

export default function NewsSection({ news }: { news: NewsItem[] }) {
  return (
    <section className="bg-[#f5f5f5] px-4 py-[clamp(2rem,3.5vw,2.75rem)]" id="noticias" aria-labelledby="news-title">
      <div className="mx-auto max-w-[var(--content-width)]">
        <h2
          className="mb-8 font-[var(--font-montserrat)] text-[length:var(--fs-h2)] font-bold leading-[.9] text-[var(--institutional-red)]"
          id="news-title"
        >
          Noticias
        </h2>
        <NewsCarousel news={news} />
        <a
          className="mx-auto mt-10 block w-fit rounded-[5px] bg-[var(--institutional-red)] px-11 py-3 font-semibold text-white transition-colors hover:bg-[var(--institutional-gold)] hover:text-black focus-visible:outline-none"
          href="#noticias"
        >
          Ver todas las noticias
        </a>
      </div>
    </section>
  );
}
