import { Suspense } from "react";
import styles from "@/app/components/home/home.module.css";
import LiveEmisora from "@/app/components/emisoraLive/emisora-live";
import HomeSkeleton from "@/app/components/home/HomeSkeleton";
import RevealSection from "@/app/components/home/RevealSection";
import { getFaculties } from "@/services/facultades";
import { getHeroSlides } from "@/services/hero";
import { getNews } from "@/services/noticias";
import { getEvents } from "@/services/eventos";
import EnrollmentSection from "@/app/components/home/EnrollmentSection";
import FacultiesSection from "@/app/components/home/FacultiesSection";
import HeroSection from "@/app/components/home/HeroSection";
import NewsSection from "@/components/common/news-section/news-section";
import QuickLinksSection from "@/app/components/home/QuickLinksSection";
import ServicesSection from "@/app/components/home/ServicesSection";
import StudentServicesSection from "@/app/components/home/StudentServicesSection";
import UniversityPromoSection from "@/app/components/home/UniversityPromoSection";

/**
 * Contenido real de la home. Separado en su propio componente async para que
 * el <Suspense> de la pagina pueda mostrar <HomeSkeleton /> mientras se
 * resuelven los datos (facultades, hero y noticias).
 */
async function HomeContent() {
  const [faculties, heroSlides, news, events] = await Promise.all([
    getFaculties(),
    getHeroSlides(),
    getNews(),
    getEvents(),
  ]);

  return (
    <div className={styles.homeShowcase}>
      <RevealSection>
        <HeroSection slides={heroSlides} />
      </RevealSection>
      <RevealSection delay={0.04}>
        <QuickLinksSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <FacultiesSection faculties={faculties} />
      </RevealSection>
      <RevealSection delay={0.04}>
        <NewsSection news={news} events={events} />
      </RevealSection>
      <RevealSection delay={0.04}>
        <EnrollmentSection />
      </RevealSection>
      <RevealSection delay={0.04} disableMotion>
        <StudentServicesSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <ServicesSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <UniversityPromoSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <LiveEmisora />
      </RevealSection>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
