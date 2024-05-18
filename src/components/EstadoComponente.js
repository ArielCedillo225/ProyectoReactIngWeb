import React, { PureComponent, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import withReactContent from "sweetalert2-react-content";
import { alerta } from "../utils";
import CustomInput from "./CustomInput";

const EstadoComponente = () => {
  const url = "http://localhost:8080";

  const [Estados, setEstados] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState("");
  const [operacion, setOperacion] = useState(1);
  const [titulo, setTitulo] = useState("");

  const ListarEstado = async () => {
    const respuesta = await axios.get(url + "/Listar");
    setEstados(respuesta.data);
  };

  const excelDownload = () => {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Convertir los datos en una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(Estados);

    // Agregar la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estados");

    // Generar el archivo Excel
    XLSX.writeFile(workbook, "estados.xlsx");
  };

  const consumoAPI = async (pMetodo, pParametros, pURL) => {
    await axios({ method: pMetodo, url: pURL, data: pParametros })
      .then((vRespuesta) => {
        var vStatus = vRespuesta.status;
        if (vStatus === 200) {
          alerta("Registro insertado correctamente", "success");
          document.getElementById("btncerrar").click();
          ListarEstado();
        }
      })
      .catch((error) => {
        alerta("Error al registrar estado " + error, "error");
      });
  };

  const EliminarEstado = (pId, pNombre) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Seguro que desea eliminar el estado " + pNombre + "?",
      icon: "question",
      text: "No se podra dar marcha atras",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        setId(pId);
        consumoAPI("DELETE", null, url + "/Eliminar/" + id);
        console.log("eliminado");
      } else {
        alerta("No se eliminara el estado ", "info");
      }
    });
  };

  useEffect(() => {
    ListarEstado();
  }, []);

  const aperturaModal = (pOperacion, pId, pNombre, pDescripcion, pActivo) => {
    console.log("apertura correcta haciendo" + pOperacion);
    setId("");
    setNombre("");
    setDescripcion("");
    setActivo("");
    setOperacion(pOperacion);
    if (pOperacion === 1) {
      setTitulo("Registrar nuevo estado");
    } else if (pOperacion === 2) {
      setTitulo("Editar estado");
      setId(pId);
      setNombre(pNombre);
      setDescripcion(pDescripcion);
      setActivo(pActivo);
    }
    window.setTimeout(() => {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const validarCampos = () => {
    var vParametros;
    var vMetodo;
    var vURL;

    if (nombre.trim() === "") {
      alerta("No se ha ingresado un nombre para el estado", "warning");
    } else if (descripcion.trim() === "") {
      alerta("No se ha ingresado una descripcion para el estado", "warning");
    } else if (activo.trim() === "") {
      alerta("No se indicado si ese estado se encuentra activo", "warning");
    } else {
      if (operacion === 1) {
        vParametros = {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          actico: activo.trim(),
        };
        vMetodo = "POST";
        vURL = url + "/Crear";
      } else {
        vParametros = {
          id: id,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          actico: activo.trim(),
        };
        vMetodo = "PUT";
        vURL = url + "/Actualizar";
      }

      consumoAPI(vMetodo, vParametros, vURL);
    }
  };

  return (
    <div className="app">
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalEstado"
                onClick={() => aperturaModal(1)}
              >
                <i className="fa-solid facircle-plus">Agregar</i>
              </button>
              <button onClick={excelDownload} className="btn btn-success">
                Descargar Excel
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Activo</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {Estados.map((estado, id) => (
                    <tr key={estado.id}>
                      <td>{estado.id}</td>
                      <td>{estado.nombre}</td>
                      <td>{estado.descripcion}</td>
                      <td>{estado.activo}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEstado"
                          onClick={() =>
                            aperturaModal(
                              2,
                              estado.id,
                              estado.nombre,
                              estado.descripcion,
                              estado.activo
                            )
                          }
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            EliminarEstado(estado.id, estado.nombre)
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div id="modalEstado" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input type="hidden" id="id"></input>

              {/*Input para ingreso de nombre*/}

              <CustomInput
                id="nombre"
                placeholder="Nombre"
                value={descripcion}
                onChange={(e) => setNombre(e.target.value)}
              />

              {/*Input para ingreso de descripcion*/}
              <CustomInput
                id="descripcion"
                placeholder="Descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              {/*Input para ingreso de activo*/}
              <CustomInput
                id="activo"
                placeholder="Activo"
                value={descripcion}
                onChange={(e) => setActivo(e.target.value)}
              />

              <div className="d-grid col-6 mx-auto">
                <button
                  className="btn btn-success"
                  onClick={() => validarCampos()}
                >
                  <i className="fa-solid fa-floppy-disck"></i>
                  Guardar
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                id="btncerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoComponente;
