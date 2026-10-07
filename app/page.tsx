import styles from "@/components/home/home.module.css";
import LiveEmisora from "@/components/emisoraLive/emisora-live";
import RevealSection from "@/components/home/RevealSection";

import {
  EnrollmentSection,
  FacultiesSection,
  FacultyCurtainSection,
  FacultyShowcaseSection,
  HeroSection,
  NewsSection,
  QuickLinksSection,
  ServicesSection,
  StudentServicesSection,
  UniversityPromoSection,
} from "@/components/home";

export default function Home() {
  return (
    <div className={styles.homeShowcase}>
      <RevealSection>
        <HeroSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <QuickLinksSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <FacultiesSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <NewsSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <FacultyCurtainSection />
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
        <FacultyShowcaseSection />
      </RevealSection>
      <RevealSection delay={0.04}>
        <LiveEmisora />
      </RevealSection>
    </div>
  );
}
