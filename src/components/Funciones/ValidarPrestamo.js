import { alerta } from "../../utils";
import fechaActual from "./FechaActual";

const ValidarPrestamo = (cliente, producto, fechaDevolucion, cantidad) => {
  var vParametros;
  var fechaMaxima = new Date("2025,1,1");
  var fDevolucion = new Date(fechaDevolucion);
  var fActual = new Date(fechaActual);

  var regex = /^[0-9]+$/;
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!regex.test(cliente)) {
    alerta("Ingrese solo números en el campo cliente", "warning");
  } else if (!regex.test(producto)) {
    alerta("Ingrese solo números en el campo producto", "warning");
  } else if (!regex.test(cantidad)) {
    alerta("Ingrese solo números en el campo cantidad", "warning");
  } else if (cantidad === 0) {
    alerta("La cantidad debe ser mayor a cero", "warning");
  } else if (!datePattern.test(fechaDevolucion)) {
    alerta("El formato del campo debe ser AAAA-MM-DD", "warning");
  } else if (fDevolucion > fechaMaxima) {
    alerta("La fecha de devolución debe ser antes del 2025-01-01", "warning");
  } else if (fDevolucion <= fActual) {
    alerta("La fecha de devolución debe mayor a la fecha actual", "warning");
  } else {
    return (vParametros = {
      cliente: cliente,
      producto: producto,
      fechaDevolucion: fechaDevolucion,
      cantidad: cantidad,
    });
  }
};

export default ValidarPrestamo;
