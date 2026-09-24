import styles from "@/components/home/home.module.css";
import LiveEmisora from "@/components/emisoraLive/emisora-live";

import {
  EnrollmentSection,
  FacultiesSection,
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
      <HeroSection />
      <QuickLinksSection />
      <FacultiesSection />
      <NewsSection />
      <EnrollmentSection />
      <StudentServicesSection />
      <ServicesSection />
      <UniversityPromoSection />
      <FacultyShowcaseSection />
      <LiveEmisora />
    </div>
  );
}
