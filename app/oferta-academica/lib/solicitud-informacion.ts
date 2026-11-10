import { z } from "zod";

export const solicitudInformacionSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(80, "El nombre no puede superar los 80 caracteres."),
  apellido: z.string().trim().min(2, "Escribe tu apellido.").max(80, "El apellido no puede superar los 80 caracteres."),
  tipoDocumento: z.enum(
    ["cedula_ciudadania", "cedula_extranjeria", "tarjeta_identidad", "pasaporte"],
    { error: "Selecciona tu tipo de documento." },
  ),
  numeroDocumento: z
    .string()
    .trim()
    .min(5, "Escribe un número de documento válido.")
    .max(20, "El número de documento no puede superar los 20 caracteres.")
    .regex(/^[a-zA-Z0-9.-]+$/, "Usa solo letras, números, puntos o guiones."),
  correo: z.string().trim().email("Escribe un correo electrónico válido."),
  telefono: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]+$/, "Escribe un teléfono válido.")
    .refine((telefono) => {
      const digitos = telefono.replace(/\D/g, "").length;
      return digitos >= 7 && digitos <= 15;
    }, "El teléfono debe tener entre 7 y 15 dígitos."),
  autorizaTratamientoDatos: z.boolean().refine(Boolean, {
    error: "Debes autorizar el tratamiento de tus datos personales para continuar.",
  }),
  programaId: z.string().min(1),
  programaNombre: z.string().min(1),
  website: z.string().optional(),
});

export type SolicitudInformacion = z.infer<typeof solicitudInformacionSchema>;

/** TODO: reemplazar por el envío real a Drupal o al servicio de contacto institucional. */
export async function enviarSolicitudInformacion(solicitud: SolicitudInformacion): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      void solicitud;
      resolve();
    }, 650);
  });
}
