import checkArroba from "./CheckCorreo";
import { alerta } from "../../utils";
import fechaActual from "./FechaActual";

const ValidarCliente = (
  nombres,
  identificacion,
  direccion,
  telefono,
  correo,
  fechaNacimiento
) => {
  var vParametros;
  var fNacimiento = new Date(fechaNacimiento);
  var fActual = new Date(fechaActual);
  var regex = /^[0-9]+$/;
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!regex.test(identificacion)) {
    alerta("Ingrese solo números en el campo identificacion", "warning");
  } else if (nombres.trim() === "") {
    alerta("Ingrese valores en el nombre", "warning");
  } else if (direccion.trim() === "") {
    alerta("Ingrese valores en la direccion", "warning");
  } else if (!regex.test(telefono)) {
    alerta("Ingrese solo números en el campo telefono", "warning");
  } else if (!datePattern.test(fechaNacimiento)) {
    alerta("El formato del campo debe ser AAAA-MM-DD", "warning");
  } else if (!checkArroba(correo)) {
    alerta(
      "El correo debe contener una arroba que se encuentre entre el texto",
      "warning"
    );
  } else if (fNacimiento >= fActual) {
    alerta(
      "La fecha de nacimiento debe ser menor a la fecha actual",
      "warning"
    );
  } else {
    return (vParametros = {
      nombres: nombres,
      identificacion: identificacion,
      direccion: direccion,
      telefono: telefono,
      correo: correo,
      fechaNacimiento: fechaNacimiento,
    });
  }
};

export default ValidarCliente;
