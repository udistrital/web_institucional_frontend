"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Universidad Distrital le da la bienvenida a los nuevos estudiantes y sus familias",
    description: "Bienestar Universitario, anunció la fecha establecida para la realización del evento de bienvenida",
    image: "/image/hero.jpeg",
    alt: "Estudiante de la Universidad Distrital usando casco de seguridad",
  },
  {
    title: "Construimos universidad con compromiso social",
    description: "Conoce las noticias y actividades que conectan a nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria reunida en una actividad institucional",
  },
];

const audiences = [
  { title: "Soy Estudiante", image: "/image/soy estudiante.jpeg", alt: "Estudiante sonriendo mientras usa un computador portátil" },
  { title: "Soy Profesor", image: "/image/soy docente.jpeg", alt: "Profesora trabajando con un computador portátil" },
  { title: "Soy Funcionario", image: "/image/soy funcionario.jpeg", alt: "Funcionaria sonriendo dentro de una sede universitaria" },
  { title: "Vida Universitaria", image: "/image/vida universitaria.jpeg", alt: "Actividad de la vida universitaria" },
  { title: "Inscripciones", image: "/image/inscripciones.png", alt: "Información sobre inscripciones universitarias" },
  { title: "Facultades", image: "/image/facultad ingenieria.jpg", alt: "Edificio de una facultad de la Universidad Distrital" },
];

const faculties = [
  "Facultad de Artes - ASAB",
  "Facultad de Ciencias de la Salud",
  "Facultad de Tecnológica",
  "Facultad de Ingeniería",
  "Facultad de Ciencias Matemáticas y Naturales",
  "Facultad de Ciencias y Educación",
  "Facultad del Medio Ambiente y Recursos Naturales",
];

const news = [
  {
    title: "Prepárate para la VIII edición de ‘La Noche y las Lunecirnagas’",
    description: "Conoce todos los detalles de esta actividad cultural de la Universidad Distrital.",
    image: "/image/Gemini_Generated_Image_g4kw57g4kw57g4kw.jpeg",
    alt: "Afiche de una actividad cultural universitaria",
  },
  {
    title: "La Universidad Distrital fortalece su compromiso social",
    description: "Consulta las novedades y actividades de nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria participando en una actividad",
  },
];

const studentServices = [
  {
    icon: "✦",
    title: "Estudia en la UD",
    description: "Abre nuevas puertas para tu vida profesional y vive la experiencia de estudiar en la mejor universidad de Bogotá.",
  },
  {
    icon: "⌂",
    title: "Capacitaciones, cursos, talleres y diplomados",
    description: "Sabemos lo importante de complementar tus conocimientos y aumentar tu competitividad.",
  },
  {
    icon: "◎",
    title: "Transparencia y acceso a la información pública",
    description: "Consulta la información que esta entidad genera, en el desarrollo de su misión y funciones.",
  },
  {
    icon: "▣",
    title: "Aseguramiento de la calidad",
    description: "Comprometidos con tu futuro profesional, la UD cuenta con 36 programas con estándares de Alta Calidad.",
  },
];

const services = [
  {
    title: "Vida Universitaria",
    description: "En la Universidad Distrital te ofrecemos diferentes líneas del conocimiento y de bienestar donde te brindaremos apoyo integral, servicios de orientación y desarrollo personal para apoyar el aprendizaje y la investigación.",
    image: "/image/vida universitaria.jpeg",
    alt: "Estudiante sonriente con material de estudio",
  },
  {
    title: "Investigación",
    description: "Te ofrece servicios de investigación que incluyen acceso a laboratorios especializados, apoyo en proyectos de investigación, asesorías metodológicas, y recursos digitales para fomentar el desarrollo académico y la innovación.",
    image: "/image/Gemini_Generated_Image_g4kw57g4kw57g4kw.jpeg",
    alt: "Estudiante consultando un libro en una biblioteca",
  },
  {
    title: "Compromiso Social",
    description: "La Universidad te brinda servicios de extensión que conectan la educación continua con proyectos sociales, consultorías, y promueve el intercambio de conocimientos y el desarrollo comunitario.",
    image: "/image/compromiso social.jpeg",
    alt: "Estudiantes colaborando en una actividad académica",
  },
];

const facultyShowcase = [
  { title: "Facultad de Ingeniería", image: "/image/facultad ingenieria.jpg", alt: "Edificio de la Facultad de Ingeniería" },
  { title: "Facultad ASAB", image: "/image/facultad de artes.jpeg", alt: "Edificio de la Facultad de Artes ASAB" },
  { title: "Facultad de Tecnológica", image: "/image/facultad tecnologica.jpeg", alt: "Edificio de la Facultad Tecnológica" },
  { title: "Facultad de Ciencias y Educación", image: "/image/facultad ciencias y educacion.jpeg", alt: "Edificio de la Facultad de Ciencias y Educación" },
  { title: "Facultad de Ciencias de la Salud", image: "/image/facultad de ciencias de la salud.jpeg", alt: "Facultad de Ciencias de la Salud" },
  { title: "Facultad del Medio Ambiente", image: "/image/facultad de medio ambiente.jpeg", alt: "Facultad del Medio Ambiente y Recursos Naturales" },
];

export default function HomeShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [audienceStart, setAudienceStart] = useState(0);
  const [facultyStart, setFacultyStart] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const visibleAudiences = audiences.slice(audienceStart, audienceStart + 3);

  const showPreviousAudience = () => {
    setAudienceStart((current) => (current - 1 + audiences.length) % audiences.length);
  };

  const showNextAudience = () => {
    setAudienceStart((current) => (current + 1) % audiences.length);
  };

  const visibleFaculties = Array.from({ length: 3 }, (_, index) => (
    facultyShowcase[(facultyStart + index) % facultyShowcase.length]
  ));

  const showPreviousFaculty = () => {
    setFacultyStart((current) => (current - 1 + facultyShowcase.length) % facultyShowcase.length);
  };

  const showNextFaculty = () => {
    setFacultyStart((current) => (current + 1) % facultyShowcase.length);
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      void videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <main className="home-showcase">
      <section className="hero" aria-label="Noticias destacadas">
        <div className="hero-media">
          {slides.map((slide, index) => (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`hero-image ${index === activeSlide ? "is-active" : ""}`}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">Universidad Distrital</p>
          <h1>{currentSlide.title}</h1>
          <p className="hero-description">{currentSlide.description}</p>
          <a className="hero-link" href="#audiencias">Ver más</a>
        </div>
        <div className="hero-controls" aria-label="Seleccionar noticia destacada">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={`hero-dot ${index === activeSlide ? "is-active" : ""}`}
              aria-label={`Mostrar noticia ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="audience-section" id="audiencias" aria-labelledby="audience-title">
        <h2 id="audience-title" className="sr-only">Accesos según tu rol en la universidad</h2>
        <div className="audience-carousel">
          <button type="button" className="carousel-arrow" aria-label="Ver accesos anteriores" onClick={showPreviousAudience}>
            <span aria-hidden="true">‹</span>
          </button>
          <div className="audience-grid">
            {visibleAudiences.map((audience) => (
              <a className="audience-card" href="#" key={audience.title}>
                <Image src={audience.image} alt={audience.alt} fill sizes="(max-width: 720px) 88vw, 28vw" />
                <span className="audience-shade" />
                <span className="audience-title">{audience.title}</span>
              </a>
            ))}
          </div>
          <button type="button" className="carousel-arrow" aria-label="Ver accesos siguientes" onClick={showNextAudience}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </section>

      <section className="faculties-section" aria-labelledby="faculties-title">
        <div className="faculties-content">
          <div className="faculties-intro">
            <h2 id="faculties-title">Nuestras<br />Facultades</h2>
            <a className="faculties-link" href="#noticias">Ver programas</a>
          </div>
          <ul className="faculties-list">
            {faculties.map((faculty) => (
              <li key={faculty}><a href="#noticias">{faculty}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="news-section" id="noticias" aria-labelledby="news-title">
        <div className="news-content">
          <h2 id="news-title">Noticias</h2>
          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item.title}>
                <Image src={item.image} alt={item.alt} width={640} height={360} />
                <div className="news-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#noticias">Ver más</a>
                </div>
              </article>
            ))}
          </div>
          <a className="news-more-link" href="#noticias">Ver más noticias</a>
        </div>
      </section>

      <section className="enrollment-section" aria-labelledby="enrollment-title">
        <div className="enrollment-content">
          <div className="enrollment-copy">
            <h2 id="enrollment-title">Inscribe o solicita<br />información</h2>
            <p>
              Si necesitas más información para estudiar en la UD, selecciona una opción y te enviaremos toda la información que necesites acerca del estudio de tu interés.
            </p>
            <div className="enrollment-actions">
              <a className="enrollment-primary" href="#inscripciones">Quiero Inscribirme</a>
              <a className="enrollment-secondary" href="#informacion">Solicitar Información</a>
            </div>
          </div>
          <Image
            className="enrollment-image"
            src="/image/inscripciones.png"
            alt="Estudiante sonriente con una tableta y una mochila"
            width={448}
            height={557}
          />
        </div>
      </section>

      <section className="student-services-section" aria-labelledby="student-services-title">
        <h2 id="student-services-title" className="sr-only">Información para estudiantes</h2>
        <div className="student-services-grid">
          {studentServices.map((service) => (
            <a className="student-service" href="#informacion" key={service.title}>
              <span className="student-service-icon" aria-hidden="true">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="services-section" id="servicios" aria-labelledby="services-title">
        <div className="services-content">
          <header className="services-heading">
            <h2 id="services-title">Gestión de Servicios</h2>
            <p>Encuentra en un solo lugar los servicios, recursos y soluciones que tenemos disponibles para ti. Consulta información, accede fácilmente a cada servicio y gestiona tus solicitudes de manera rápida y sencilla.</p>
          </header>
          <div className="services-list">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <Image src={service.image} alt={service.alt} width={640} height={360} />
                <div className="service-card-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#servicios">Ver más</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="university-promo" id="video-institucional" aria-labelledby="promo-title">
        <div className="promo-media">
          <video
            ref={videoRef}
            className="promo-video"
            poster="/image/hero.jpeg"
            preload="metadata"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          >
            <source src="/video/Udistrital.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
          <button className={`promo-play ${isVideoPlaying ? "is-playing" : ""}`} type="button" aria-label={isVideoPlaying ? "Pausar video institucional" : "Reproducir video institucional"} aria-pressed={isVideoPlaying} onClick={toggleVideo}>
            <span aria-hidden="true">{isVideoPlaying ? "Ⅱ" : "▶"}</span>
          </button>
        </div>
        <div className="promo-copy">
          <h2 id="promo-title">Sé parte de la<br />Universidad Distrital</h2>
          <p>Nuestra oferta académica está compuesta por carreras en las siguientes áreas de conocimiento: artes, comunicación, sistemas, educación, forestal, ambiental, electrónica, telecomunicaciones, sanitaria, administración, matemáticas, ciencias naturales, civil, bibliotecología, eléctrica, industrial y telemática.</p>
        </div>
      </section>

      <section className="faculty-showcase" aria-labelledby="faculty-showcase-title">
        <h2 id="faculty-showcase-title" className="sr-only">Facultades de la Universidad Distrital</h2>
        <button className="faculty-arrow faculty-arrow-previous" type="button" aria-label="Ver facultades anteriores" onClick={showPreviousFaculty}>‹</button>
        <div className="faculty-showcase-grid">
          {visibleFaculties.map((faculty) => (
            <a className="faculty-showcase-card" href="#facultades" key={faculty.title}>
              <Image src={faculty.image} alt={faculty.alt} fill sizes="(max-width: 720px) 100vw, 33vw" />
              <span className="faculty-showcase-shade" />
              <span className="faculty-play" aria-hidden="true">▶</span>
              <span className="faculty-showcase-title">{faculty.title}</span>
            </a>
          ))}
        </div>
        <button className="faculty-arrow faculty-arrow-next" type="button" aria-label="Ver facultades siguientes" onClick={showNextFaculty}>›</button>
      </section>
    </main>
  );
}