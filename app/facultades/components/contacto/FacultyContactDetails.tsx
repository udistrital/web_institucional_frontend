import type { Faculty } from "@/services/facultades";

type FacultyContactDetailsProps = {
  attributes: Faculty["attributes"];
  /** Clase del `<dl>`; cada página define los estilos de `dt`, `dd` y enlaces. */
  className?: string;
};

/** Datos de contacto de una facultad. Los campos vacíos no se muestran. */
export default function FacultyContactDetails({
  attributes,
  className,
}: FacultyContactDetailsProps) {
  return (
    <dl className={className}>
      {attributes.field_direccion && (
        <div>
          <dt>Dirección</dt>
          <dd>{attributes.field_direccion}</dd>
        </div>
      )}
      {attributes.field_correo_electronico && (
        <div>
          <dt>Correo electrónico</dt>
          <dd>
            <a href={`mailto:${attributes.field_correo_electronico}`}>
              {attributes.field_correo_electronico}
            </a>
          </dd>
        </div>
      )}
      {attributes.field_horario && (
        <div>
          <dt>Horario de atención</dt>
          <dd>{attributes.field_horario}</dd>
        </div>
      )}
      {attributes.field_pbx?.processed && (
        <div>
          <dt>Teléfono</dt>
          <dd dangerouslySetInnerHTML={{ __html: attributes.field_pbx.processed }} />
        </div>
      )}
    </dl>
  );
}
