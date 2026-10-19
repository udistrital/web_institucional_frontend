import styles from "@/components/home/home.module.css";
import LiveEmisora from "@/components/ui/emisoraLive/emisora-live";
import RevealSection from "@/components/home/RevealSection";
import { getFaculties } from "@/lib/faculties";

import {
  EnrollmentSection,
  FacultiesSection,
  HeroSection,
  NewsSection,
  QuickLinksSection,
  ServicesSection,
  StudentServicesSection,
  UniversityPromoSection,
} from "@/components/home";

export default async function Home() {
  const faculties = await getFaculties();

  return (
    <div className={styles.homeShowcase}>
      <RevealSection>
        <HeroSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <QuickLinksSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <FacultiesSection faculties={faculties} />
      </RevealSection>
      <RevealSection delay={0.04}>
        <NewsSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <EnrollmentSection />
      </RevealSection>
      <RevealSection delay={0.04}>
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
