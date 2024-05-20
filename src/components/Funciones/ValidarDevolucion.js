import { alerta } from "../../utils";

const ValidarDevolucion = (id, parcial, cantidad) => {
  var vParametros;
  var regex = /^[0-9]+$/;

  if (parcial < 0 && parcial > 1) {
    alerta("El parcial solo puede ser 0 o 1", "warning");
  } else if (!regex.test(cantidad)) {
    alerta("Ingrese solo números en el campo cantidad", "warning");
  } else {
    return (vParametros = {
      id: id,
      parcial: parcial,
      cantidad: cantidad,
    });
  }
};

export default ValidarDevolucion;
