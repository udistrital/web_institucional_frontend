import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import styles from "@/components/home/home.module.css";
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
    <>
      <Header />
      <main className={styles.homeShowcase}>
        <HeroSection />
        <QuickLinksSection />
        <FacultiesSection />
        <NewsSection />
        <EnrollmentSection />
        <StudentServicesSection />
        <ServicesSection />
        <UniversityPromoSection />
        <FacultyShowcaseSection />
      </main>
      <Footer/>
    </>
  );
}