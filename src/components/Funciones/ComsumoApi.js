import axios from "axios";
import { alerta } from "../../utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

let baseUrl = "";

export const Listar = async (url) => {
  baseUrl = url;
  const respuesta = await axios.get(url + "/Listar");
  return respuesta.data;
};

export const Consumir = async (pMetodo, pParametros, pUrl) => {
  await axios({ method: pMetodo, url: pUrl, data: pParametros })
    .then((vRespuesta) => {
      var vStatus = vRespuesta.status;
      if (vStatus === 200) {
        alerta(vRespuesta.data, "info");
        document.getElementById("btncerrar").click();
      }
    })
    .catch((error) => {
      alerta("Error al realizar la operación. " + error, "error");
    });
};

export const Eliminar = (pId, pExtra, tipo) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: "Seguro que desea eliminar el " + tipo + " " + pExtra + "?",
    icon: "question",
    text: "No se podra dar marcha atras",
    showCancelButton: true,
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      Consumir("DELETE", null, baseUrl + "/Eliminar/" + pId);
    } else {
      alerta("No se eliminara el estado ", "info");
    }
  });
};
