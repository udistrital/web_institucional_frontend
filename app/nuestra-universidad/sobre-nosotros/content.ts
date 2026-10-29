/**
 * Contenido estático de la página "Sobre Nosotros".
 *
 * Esta información es institucional y no cambia con frecuencia, por lo que se
 * mantiene en el repositorio en lugar de consumirse desde Drupal. La única
 * excepción es la foto y la descripción del rector, que se obtienen del
 * servicio de integrantes (ver `services/integrantes.ts`).
 */

export type SectionId = "funciones-misionales" | "directivos" | "historia" | "simbolos";

export type SectionLink = {
  id: SectionId;
  label: string;
};

export const SECTIONS: SectionLink[] = [
  { id: "funciones-misionales", label: "Funciones misionales" },
  { id: "directivos", label: "Directivos" },
  { id: "historia", label: "Historia" },
  { id: "simbolos", label: "Símbolos" },
];

/* ------------------------------------------------------------------ */
/* 1. Funciones misionales                                            */
/* ------------------------------------------------------------------ */

export type FuncionMisional = {
  titulo: string;
  descripcion: string;
};

export const FUNCIONES_INTRO: string[] = [
  "La Universidad Distrital Francisco José de Caldas se reconoce a sí misma como la institución de educación superior del Distrito Capital de Bogotá y de la Región Central de la República de Colombia, por consiguiente su visión de futuro está estrechamente ligada a los procesos de su entorno social. El proyecto educativo institucional encuentra sentido en el fortalecimiento estratégico de sus potencialidades académicas y en las posibilidades que ellas ofrecen al desarrollo de la región.",
  "La Universidad Distrital Francisco José de Caldas deberá hacerse más competitiva ante pares del mundo académico y universitario. Por ello, con una visión estratégica ha decidido canalizar los esfuerzos y recursos en torno a cinco áreas académicas prioritarias: lo ambiental, la comunicación, la informatización, la educación y la producción.",
];

export const FUNCIONES: FuncionMisional[] = [
  {
    titulo: "Formación",
    descripcion:
      "La Universidad, fundamentada en sus principios, fomenta y propicia el desarrollo cultural, filosófico, científico, tecnológico, artístico, pedagógico y ético en los diferentes campos del saber como factor de modernidad y cambio en la sociedad colombiana. Por su carácter de Centro de Educación Superior propicia todas las formas de búsqueda e interpretación de la realidad, en un ambiente de respeto de la autonomía individual y de las libertades académicas, de investigación, de expresión, de asociación, de información, de aprendizaje y de cátedra.",
  },
  {
    titulo: "Investigación",
    descripcion:
      "La investigación es una actividad permanente, fundamental e imprescindible y el sustento del espíritu de la Universidad Distrital Francisco José de Caldas. Está orientada a ampliar los distintos campos del saber, a crear y adecuar tecnologías. En esa medida, tiene como finalidad fundamentar, orientar y viabilizar la formación de líderes de su campo para buscar soluciones a los problemas de la comunidad.",
  },
  {
    titulo: "Extensión y Proyección Social",
    descripcion:
      "La enseñanza, la investigación y la extensión están orientadas a satisfacer y atender conveniencias del país y del Distrito Capital de Bogotá, así como el imperativo de la unidad nacional, de acuerdo con los principios de planeación, procurando la armonía con los planes de desarrollo económico y social de orden nacional y distrital.",
  },
];

export const FUNCIONES_FUENTE =
  "Estatuto General de la Universidad Distrital. Capítulo II, Principios y objetivos.";

/* ------------------------------------------------------------------ */
/* 2. Directivos                                                      */
/* ------------------------------------------------------------------ */

export type OrganoDireccion = {
  titulo: string;
  descripcion: string;
  miembros?: string[];
  enlace?: { label: string; href: string };
};

export const ORGANOS_DIRECCION: OrganoDireccion[] = [
  {
    titulo: "Consejo Superior Universitario",
    descripcion:
      "El Consejo Superior Universitario es el máximo órgano de dirección y gobierno de la Universidad y está integrado por los siguientes miembros:",
    miembros: [
      "El Alcalde Mayor de Bogotá, o su delegado, quien lo preside.",
      "Un representante del Presidente de la República, que haya tenido vínculos con el sector universitario, quien preside las sesiones en ausencia del Alcalde Mayor o su delegado.",
      "El Ministro de Educación Nacional, o su delegado.",
      "Un representante de las directivas académicas, elegido por el Consejo Académico entre sus miembros, por el término en el cual desempeñe sus funciones como miembro del Consejo Académico.",
    ],
    enlace: {
      label: "Ver integrantes del Consejo Superior",
      href: "/forocsu/integrantes",
    },
  },
  {
    titulo: "Consejo Académico",
    descripcion:
      "El Consejo Académico es la máxima autoridad académica de la Universidad. Está integrado por:",
    miembros: [
      "El Rector, quien es su presidente.",
      "El Vicerrector Académico, quien es su vicepresidente.",
      "El Vicerrector Administrativo y Financiero.",
      "Los Decanos.",
      "El Director del Centro de Investigaciones y Desarrollo Científico.",
    ],
    enlace: {
      label: "Ver más sobre el Consejo Académico",
      href: "http://sgral.udistrital.edu.co/sgral/index.php?option=com_content&task=view&id=21&Itemid=55",
    },
  },
  {
    titulo: "Rectoría",
    descripcion:
      "El Rector es el representante legal y la primera autoridad académica, administrativa y ejecutiva de la Universidad Distrital Francisco José de Caldas. Es nombrado por el Consejo Superior Universitario para un periodo de cuatro años y se posesiona ante el Presidente del Consejo Superior Universitario. Le corresponde la dirección general de la Universidad, la formulación de políticas y la adopción de planes, programas y proyectos para su ejecución.",
  },
];

/* ------------------------------------------------------------------ */
/* 3. Historia (línea de tiempo)                                      */
/* ------------------------------------------------------------------ */

export const HISTORIA_INTRO: string[] = [
  "La Universidad Distrital Francisco José de Caldas es una institución autónoma de educación superior, de carácter público, constituida esencialmente por procesos y relaciones que generan estudiantes y profesores identificados en la búsqueda libre del saber.",
  "Su misión se concreta en la calificación de egresados con capacidad de actuar como protagonistas del cambio social y de sí mismos, en la formación del espíritu científico aplicado a la indagación, interpretación y modificación de la realidad, y en la contribución a forjar ciudadanos idóneos para promover el progreso de la sociedad.",
  "Su historia es parte de la historia de la ciudad, y su desarrollo es reflejo de la constancia y dedicación de quienes concibieron una institución de carácter público, con el objetivo de ofrecer educación a los sectores populares de la ciudad y del país.",
];

export type HitoHistorico = {
  anio: string;
  titulo: string;
  descripcion: string;
  /** Imagen histórica opcional asociada al hito (ruta en /public). */
  imagen?: string;
  /** Texto alternativo descriptivo de la imagen. */
  imagenAlt?: string;
};

export const HITOS: HitoHistorico[] = [
  {
    anio: "1947",
    titulo: "Un proyecto para la educación popular",
    descripcion:
      "El líder liberal Jorge Eliécer Gaitán y el economista Antonio García Nossa impulsan una reforma a la educación técnica y tecnológica. Como concejal de Bogotá, García Nossa radica el 15 de diciembre el proyecto para crear un Colegio Municipal para Varones, pensado para que jóvenes de escasos recursos terminaran su bachillerato e ingresaran a la Universidad.",
  },
  {
    anio: "1948",
    titulo: "Nace el Colegio Municipal de Bogotá",
    descripcion:
      "Mediante el Acuerdo número 10 de febrero se crea el Colegio Municipal de Bogotá. Tras el asesinato de Gaitán el 9 de abril y el estallido del “bogotazo”, la apertura se posterga hasta julio, cuando la institución es inaugurada y recibe el nombre de Colegio Municipal de Bogotá Jorge Eliécer Gaitán, con Gabriel Anzola Gómez como primer rector.",
    imagen: "/historia/el-tiempo-1949.jpg",
    imagenAlt: "Aviso publicado en el diario El Tiempo el 9 de abril de 1949.",
  },
  {
    anio: "1950",
    titulo: "Fundación de la Universidad Municipal",
    descripcion:
      "El 6 de agosto, con la presencia del Presidente Mariano Ospina Pérez, se firma el Acta de Fundación de la Universidad Municipal de Bogotá. Meses después, el rector Daniel de Cayzedo obtiene la personería jurídica e incluye por primera vez el nombre del prócer “Francisco José de Caldas”.",
    imagen: "/historia/casa-navarro-1951-1953.jpg",
    imagenAlt: "Casa Navarro, sede de la Universidad entre 1951 y 1953.",
  },
  {
    anio: "1951",
    titulo: "Los primeros estudiantes",
    descripcion:
      "Ingresan los primeros estudiantes, inscritos en dos carreras: Ingeniería Forestal e Ingeniería Electrónica. Las clases se ofrecen en la primera sede de la Universidad, compartida con el Colegio Municipal, hoy la IED Jorge Eliécer Gaitán, en el barrio Modelo Norte.",
    imagen: "/historia/primera-sede-ied-gaitan.jpg",
    imagenAlt:
      "Primera sede del Colegio y de la Universidad Municipal, hoy IED Jorge Eliécer Gaitán.",
  },
  {
    anio: "1953",
    titulo: "La primera promoción de egresados",
    descripcion:
      "Se gradúan los primeros estudiantes, que pronto ingresan a empresas públicas y privadas de los sectores forestal, topográfico y electrónico, en entidades como el Ministerio de Agricultura o Inravisión.",
    imagen: "/historia/graduados-1953.jpg",
    imagenAlt: "Graduados de 1953. Fuente: Oficina de Egresados.",
  },
  {
    anio: "1955",
    titulo: "De “municipal” a “distrital”",
    descripcion:
      "Bogotá pasa a ser “Distrito Especial” y todas las entidades municipales se denominan “distritales”. La Universidad reanuda actividades en antiguas oficinas de los Ferrocarriles Nacionales. En 1957 comienza a ser reconocida como institución de educación superior de carácter estatal.",
    imagen: "/historia/casa-centro-bogota-1955-1959.jpg",
    imagenAlt:
      "Casa de la Universidad en el centro de Bogotá, 1955-1959. Fotografía: Carlos Arturo Reina.",
  },
  {
    anio: "1960",
    titulo: "La sede de la calle 40",
    descripcion:
      "Se adquiere la sede de la calle 40 y un lote adyacente que con el tiempo sería llamado “Patio Bonito”. Durante la década también se incorpora la sede Venado de Oro, sobre la avenida Circunvalar.",
    imagen: "/historia/sede-central-1961.jpg",
    imagenAlt: "Instalaciones de la sede Central en 1961.",
  },
  {
    anio: "1972",
    titulo: "Nuevas facultades y crecimiento",
    descripcion:
      "Se abren las Facultades de Ingeniería de Sistemas e Ingeniería Industrial, y el Departamento de Ciencias Fundamentales inicia carreras para la formación de maestros, que más tarde darían origen a la Facultad de Ciencias y Educación.",
    imagen: "/historia/edificio-ingenieria-forestal.png",
    imagenAlt: "Edificio de Ingeniería Forestal.",
  },
  {
    anio: "1979",
    titulo: "Cierre y crisis",
    descripcion:
      "Problemas presupuestales y tensiones internas derivan en el cierre de la institución, ordenado en mayo por el Alcalde Mayor Hernando Durán Dussán. Previsto para unos meses, se extiende más de dos años; de cerca de 4000 estudiantes, al reabrir se reintegran alrededor de 600.",
  },
  {
    anio: "1982",
    titulo: "Reapertura y reestructuración",
    descripcion:
      "Comienza una nueva etapa. En 1984 se inaugura la sede Macarena, que albergará buena parte de las carreras de Ingeniería y Licenciatura. Las carreras quedan organizadas en dos facultades: Ciencias y Educación, e Ingeniería.",
    imagen: "/historia/sede-macarena-a-1981.png",
    imagenAlt: "Sede Macarena A en 1981.",
  },
  {
    anio: "1993",
    titulo: "Modernización y nuevas facultades",
    descripcion:
      "Se crea la Facultad Tecnológica en Ciudad Bolívar y, entre 1993 y 1994, la Facultad del Medio Ambiente y Recursos Naturales en la antigua sede Venado de Oro. Se amplían los programas de posgrado iniciados a finales de los ochenta.",
    imagen: "/historia/construccion-sede-calle-40.png",
    imagenAlt: "Construcción de la sede Calle 40.",
  },
  {
    anio: "2005",
    titulo: "La Facultad de Artes ASAB",
    descripcion:
      "La Academia Superior de Artes de Bogotá se integra a la Universidad, inicialmente mediante convenio y, desde 2005, como Facultad de Artes ASAB. En 2001 había nacido la emisora institucional LAUD Estéreo 90.4 FM.",
  },
  {
    anio: "2010",
    titulo: "La Aduanilla de Paiba",
    descripcion:
      "La Universidad adquiere los predios del antiguo Matadero Municipal y los transforma en su biblioteca central, conocida como “Aduanilla de Paiba”. La década también deja la apertura de los doctorados en Educación, Ingeniería y Estudios Sociales.",
  },
  {
    anio: "Hoy",
    titulo: "Una universidad en permanente transformación",
    descripcion:
      "La proyección de crecimiento gira en torno a la nueva sede “El Porvenir”, en la localidad de Bosa. A lo largo de su historia, estudiantes, profesores, trabajadores y personal administrativo han mantenido vigente el legado inspirado en Antonio García Nossa, Jorge Eliécer Gaitán y el presbítero Daniel de Cayzedo.",
    imagen: "/historia/universidad-de-bogota.png",
    imagenAlt: "La Universidad Distrital Francisco José de Caldas en la actualidad.",
  },
];

/* ------------------------------------------------------------------ */
/* 4. Símbolos                                                        */
/* ------------------------------------------------------------------ */

export const HIMNO_VIDEO_URL = "https://www.youtube.com/embed/qGiNBiFz0q0";

export const HIMNO_ESTROFAS: string[][] = [
  [
    "Creadora perenne de ideas,",
    "hacedora de sueños sin fin,",
    "luz de oro que alumbra el camino,",
    "de mil triunfos y gran porvenir.",
  ],
  [
    "Cinco estrellas conducen tu frente",
    "por la ciencia, el arte, el saber,",
    "y de ellas brotando el mañana",
    "que a tus hijos les has de ofrecer.",
  ],
  [
    "Es tu nombre el de un prócer gallardo",
    "que sapiencia febril te heredó,",
    "tu apellido recuerda tu cuna:",
    "Santafé que en su lid te arrulló.",
  ],
  [
    "Incólume ante un mundo cambiante",
    "es tu meta sembrar libertad,",
    "entregando la espada flamante",
    "de conciencia y de fiel dignidad.",
  ],
  [
    "Creadora perenne de ideas,",
    "hacedora de sueños sin fin,",
    "luz de oro que alumbra el camino,",
    "de mil triunfos y gran porvenir.",
  ],
  [
    "En tu claustro moldeas la esencia,",
    "los valores del bien usarás,",
    "al formar la futura Colombia",
    "de progreso y de lucha tenaz.",
  ],
  [
    "Academia excelsa es tu lema,",
    "en lo alto tu nombre estará,",
    "bien grabado con letras de fuego",
    "sobre el cielo azul de Bogotá.",
  ],
  [
    "Forja eres de mentes brillantes,",
    "madre pura de genio inmortal,",
    "en tu honor cantaremos gloriosos:",
    "¡viva la Universidad Distrital!",
  ],
];

export const HIMNO_REPUBLICA_VIDEO_URL = "https://www.youtube.com/embed/SrvKADxxsqg";

export const HIMNO_REPUBLICA_ESTROFAS: string[][] = [
  [
    "Coro",
    "¡Oh gloria inmarcesible!",
    "¡Oh júbilo inmortal!",
    "¡En surcos de dolores",
    "el bien germina ya! (bis)",
  ],
  [
    "Estrofa I",
    "¡Cesó la horrible noche!",
    "La libertad sublime",
    "derrama las auroras",
    "de su invencible luz.",
    "La humanidad entera,",
    "que entre cadenas gime,",
    "comprende las palabras",
    "del que murió en la cruz.",
  ],
];

export const HIMNO_BOGOTA_VIDEO_URL = "https://www.youtube.com/embed/4fRGEyZYSWc";

export const HIMNO_BOGOTA_ESTROFAS: string[][] = [
  [
    "Coro",
    "Entonemos un himno a tu cielo,",
    "a tu tierra y tu puro vivir.",
    "¡Blanca estrella que alumbra en los Andes!",
    "¡Ancha senda que va al porvenir! (bis)",
  ],
  [
    "Estrofa I",
    "Tres guerreros abrieron tus ojos",
    "a una espada, a una cruz y a un pendón;",
    "desde entonces no hay miedo en tus lindes",
    "ni codicia en tu gran corazón. (bis)",
  ],
  [
    "Coro",
    "Entonemos un himno a tu cielo,",
    "a tu tierra y tu puro vivir.",
    "¡Blanca estrella que alumbra en los Andes!",
    "¡Ancha senda que va al porvenir! (bis)",
  ],
  [
    "Estrofa II",
    "Flor de razas, compendio y corona,",
    "en la patria no hay otra ni habrá;",
    "nuestra voz la repiten los siglos:",
    "¡Bogotá! ¡Bogotá! ¡Bogotá! (bis)",
  ],
];

export type SimboloGrafico = {
  id: "escudo" | "bandera";
  titulo: string;
  parrafos: string[];
};

export const SIMBOLOS_GRAFICOS: SimboloGrafico[] = [
  {
    id: "escudo",
    titulo: "Escudo institucional",
    parrafos: [
      "La identidad gráfica de la Universidad, establecida en 1950 como sello, ha tenido en su historia varias transformaciones e incluso ha sido reemplazada en ocasiones por otros signos y escudos que respondían a los intereses del gobierno institucional del momento.",
      "En 2013, para dar cumplimiento al Plan de Desarrollo, se inicia el estudio heráldico del escudo con el objetivo de formalizar el símbolo y establecer el manual de uso de la identidad gráfica, debido al uso indiscriminado de múltiples versiones de la imagen corporativa.",
      "Como resultado, el Acuerdo 11 del 23 de septiembre de 2015 del Consejo Superior Universitario formaliza la imagen institucional y dicta las normas principales de uso.",
    ],
  },
  {
    id: "bandera",
    titulo: "Bandera institucional",
    parrafos: [
      "La bandera es el pabellón que representa a la Universidad. Como símbolo hace parte de su identidad y rememora el origen distrital de la institución.",
      "Consiste en un rectángulo dividido en dos franjas horizontales iguales: la superior amarilla, acorde al amarillo institucional, y la inferior roja, concordante con el rojo institucional. En el centro se ubica el sello de la Universidad a color, como identificador para no confundirla con la bandera del Distrito Capital.",
    ],
  },
];
