"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  enviarSolicitudInformacion,
  solicitudInformacionSchema,
} from "../lib/solicitud-informacion";
import styles from "./solicitarInformacionForm.module.css";

type Props = {
  programaId: string;
  programaNombre: string;
  onVolver: () => void;
};

type Formulario = {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  telefono: string;
  autorizaTratamientoDatos: boolean;
  website: string;
};

const formularioInicial: Formulario = {
  nombre: "",
  apellido: "",
  tipoDocumento: "",
  numeroDocumento: "",
  correo: "",
  telefono: "",
  autorizaTratamientoDatos: false,
  website: "",
};

export default function SolicitarInformacionForm({
  programaId,
  programaNombre,
  onVolver,
}: Props) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"inicial" | "enviando" | "exito" | "error">("inicial");
  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidoRef = useRef<HTMLInputElement>(null);
  const tipoDocumentoRef = useRef<HTMLSelectElement>(null);
  const numeroDocumentoRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const autorizacionRef = useRef<HTMLInputElement>(null);
  const exitoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (estado === "exito") exitoRef.current?.focus();
  }, [estado]);

  function cambiarCampo(campo: keyof Formulario, valor: string | boolean) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actuales) => {
      if (!actuales[campo]) return actuales;
      const siguientes = { ...actuales };
      delete siguientes[campo];
      return siguientes;
    });
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrores({});
    setEstado("inicial");

    // El honeypot descarta bots sin revelarles que el formulario los detectó.
    if (formulario.website) {
      setEstado("enviando");
      await new Promise((resolve) => setTimeout(resolve, 650));
      setEstado("exito");
      return;
    }

    const resultado = solicitudInformacionSchema.safeParse({
      ...formulario,
      programaId,
      programaNombre,
    });

    if (!resultado.success) {
      const siguientesErrores: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        const campo = String(issue.path[0] ?? "");
        if (campo && !siguientesErrores[campo]) siguientesErrores[campo] = issue.message;
      }
      setErrores(siguientesErrores);
      const primero = String(resultado.error.issues[0]?.path[0] ?? "");
      switch (primero) {
        case "nombre": nombreRef.current?.focus(); break;
        case "apellido": apellidoRef.current?.focus(); break;
        case "tipoDocumento": tipoDocumentoRef.current?.focus(); break;
        case "numeroDocumento": numeroDocumentoRef.current?.focus(); break;
        case "correo": correoRef.current?.focus(); break;
        case "telefono": telefonoRef.current?.focus(); break;
        case "autorizaTratamientoDatos": autorizacionRef.current?.focus(); break;
      }
      return;
    }

    setEstado("enviando");
    try {
      await enviarSolicitudInformacion(resultado.data);
      setEstado("exito");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "exito") {
    return (
      <div className={styles.success} aria-live="polite" ref={exitoRef} role="status" tabIndex={-1}>
        <span className={styles.successIcon} aria-hidden="true">✓</span>
        <h3>¡Información enviada correctamente!</h3>
        <p>Hemos recibido tus datos y estaremos en contacto contigo pronto.</p>
        <button className={styles.secondaryButton} onClick={onVolver} type="button">
          Volver al programa
        </button>
      </div>
    );
  }

  return (
    <section className={styles.container} aria-labelledby="solicitud-informacion-titulo">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Solicitud de información</p>
          <h3 id="solicitud-informacion-titulo">Déjanos tus datos</h3>
          <p>Completa el formulario para recibir información sobre este programa.</p>
        </div>
      </div>

      <form className={styles.form} noValidate onSubmit={enviar}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="solicitud-nombre">Nombre</label>
            <input
              autoComplete="given-name"
              id="solicitud-nombre"
              maxLength={80}
              name="nombre"
              onChange={(event) => cambiarCampo("nombre", event.target.value)}
              ref={nombreRef}
              required
              aria-describedby={errores.nombre ? "solicitud-nombre-error" : undefined}
              aria-invalid={Boolean(errores.nombre)}
              value={formulario.nombre}
            />
            {errores.nombre && <span className={styles.fieldError} id="solicitud-nombre-error">{errores.nombre}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="solicitud-apellido">Apellido</label>
            <input
              autoComplete="family-name"
              id="solicitud-apellido"
              maxLength={80}
              name="apellido"
              onChange={(event) => cambiarCampo("apellido", event.target.value)}
              ref={apellidoRef}
              required
              aria-describedby={errores.apellido ? "solicitud-apellido-error" : undefined}
              aria-invalid={Boolean(errores.apellido)}
              value={formulario.apellido}
            />
            {errores.apellido && <span className={styles.fieldError} id="solicitud-apellido-error">{errores.apellido}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="solicitud-tipo-documento">Tipo de documento</label>
            <select
              id="solicitud-tipo-documento"
              name="tipoDocumento"
              onChange={(event) => cambiarCampo("tipoDocumento", event.target.value)}
              ref={tipoDocumentoRef}
              required
              aria-describedby={errores.tipoDocumento ? "solicitud-tipo-documento-error" : undefined}
              aria-invalid={Boolean(errores.tipoDocumento)}
              value={formulario.tipoDocumento}
            >
              <option value="">Selecciona una opción</option>
              <option value="cedula_ciudadania">Cédula de ciudadanía</option>
              <option value="cedula_extranjeria">Cédula de extranjería</option>
              <option value="tarjeta_identidad">Tarjeta de identidad</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
            {errores.tipoDocumento && <span className={styles.fieldError} id="solicitud-tipo-documento-error">{errores.tipoDocumento}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="solicitud-numero-documento">Número de documento</label>
            <input
              autoComplete="off"
              id="solicitud-numero-documento"
              maxLength={20}
              name="numeroDocumento"
              onChange={(event) => cambiarCampo("numeroDocumento", event.target.value)}
              ref={numeroDocumentoRef}
              required
              aria-describedby={errores.numeroDocumento ? "solicitud-numero-documento-error" : undefined}
              aria-invalid={Boolean(errores.numeroDocumento)}
              value={formulario.numeroDocumento}
            />
            {errores.numeroDocumento && <span className={styles.fieldError} id="solicitud-numero-documento-error">{errores.numeroDocumento}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="solicitud-correo">Correo electrónico</label>
            <input
              autoComplete="email"
              id="solicitud-correo"
              name="correo"
              onChange={(event) => cambiarCampo("correo", event.target.value)}
              ref={correoRef}
              required
              type="email"
              aria-describedby={errores.correo ? "solicitud-correo-error" : undefined}
              aria-invalid={Boolean(errores.correo)}
              value={formulario.correo}
            />
            {errores.correo && <span className={styles.fieldError} id="solicitud-correo-error">{errores.correo}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="solicitud-telefono">Número telefónico</label>
            <input
              autoComplete="tel"
              id="solicitud-telefono"
              inputMode="tel"
              maxLength={20}
              name="telefono"
              onChange={(event) => cambiarCampo("telefono", event.target.value)}
              ref={telefonoRef}
              required
              type="tel"
              aria-describedby={errores.telefono ? "solicitud-telefono-error" : undefined}
              aria-invalid={Boolean(errores.telefono)}
              value={formulario.telefono}
            />
            {errores.telefono && <span className={styles.fieldError} id="solicitud-telefono-error">{errores.telefono}</span>}
          </div>
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="solicitud-sitio-web">Deja este campo vacío</label>
          <input
            autoComplete="off"
            id="solicitud-sitio-web"
            name="website"
            onChange={(event) => cambiarCampo("website", event.target.value)}
            tabIndex={-1}
            value={formulario.website}
          />
        </div>

        <div className={styles.consentBlock}>
          <div className={styles.consent}>
            <input
              checked={formulario.autorizaTratamientoDatos}
              id="solicitud-autorizacion"
              name="autorizaTratamientoDatos"
              onChange={(event) => cambiarCampo("autorizaTratamientoDatos", event.target.checked)}
              ref={autorizacionRef}
              required
              type="checkbox"
              aria-describedby={errores.autorizaTratamientoDatos ? "solicitud-autorizacion-error" : undefined}
              aria-invalid={Boolean(errores.autorizaTratamientoDatos)}
            />
            <label htmlFor="solicitud-autorizacion">
              Autorizo de manera libre, previa, expresa e informada a la Universidad Distrital Francisco José de Caldas para que realice el tratamiento de mis datos personales, con la finalidad de atender mi solicitud de información sobre sus programas académicos, de acuerdo con la Ley 1581 de 2012 y su Política de Tratamiento de Datos Personales.
            </label>
          </div>
          {errores.autorizaTratamientoDatos && (
            <span className={styles.fieldError} id="solicitud-autorizacion-error">
              {errores.autorizaTratamientoDatos}
            </span>
          )}
        </div>

        {estado === "error" && (
          <p className={styles.submitError} role="alert">
            No fue posible enviar la solicitud. Inténtalo de nuevo.
          </p>
        )}

        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={onVolver} type="button">
            Volver al programa
          </button>
          <button className={styles.submitButton} disabled={estado === "enviando"} type="submit">
            {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
          </button>
        </div>
      </form>
    </section>
  );
}
