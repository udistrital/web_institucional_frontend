import styles from "@/app/components/home/home.module.css";
import LiveEmisora from "@/app/components/emisoraLive/emisora-live";
import RevealSection from "@/app/components/home/RevealSection";
import { getFaculties } from "@/services/facultades";
import { getHeroSlides } from "@/services/hero";
import { getNews } from "@/services/noticias";
import EnrollmentSection from "@/app/components/home/EnrollmentSection";
import FacultiesSection from "@/app/components/home/FacultiesSection";
import HeroSection from "@/app/components/home/HeroSection";
import NewsSection from "@/components/common/news-section/news-section";
import QuickLinksSection from "@/app/components/home/QuickLinksSection";
import ServicesSection from "@/app/components/home/ServicesSection";
import StudentServicesSection from "@/app/components/home/StudentServicesSection";
import UniversityPromoSection from "@/app/components/home/UniversityPromoSection";

export default async function Home() {
  const [faculties, heroSlides, news] = await Promise.all([
    getFaculties(),
    getHeroSlides(),
    getNews(),
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
        <NewsSection news={news} />
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
