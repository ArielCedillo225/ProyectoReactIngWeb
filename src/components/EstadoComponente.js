import React, { PureComponent, act, useEffect, useState } from "react";
import { alerta } from "../utils";
import CustomInput from "./ComponentesMenores/CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import * as ApiAriel from "./Funciones/ComsumoApi";

const EstadoComponente = () => {
  const url = "http://localhost:8080";

  const [Estados, setEstados] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState("");
  const [operacion, setOperacion] = useState(1);
  const [titulo, setTitulo] = useState("");

  {
    /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiAriel.Listar(url);
        setEstados(data);
      } catch (error) {
        console.error("Error al listar los estados:", error);
      }
    };

    fetchData();
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
    } else if (String(activo).trim() === "") {
      alerta("No se indicado si ese estado se encuentra activo", "warning");
    } else {
      if (operacion === 1) {
        vParametros = {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          activo: activo.trim(),
        };
        vMetodo = "POST";
        vURL = url + "/Registrar";
      } else {
        vParametros = {
          id: id,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          activo: activo.trim(),
        };
        vMetodo = "PUT";
        vURL = url + "/Actualizar";
      }

      ApiAriel.Consumir(vMetodo, vParametros, vURL);
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
              <button
                onClick={() => excelDownload(Estados, "Estados")}
                className="btn btn-success"
              >
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
                            ApiAriel.Eliminar(
                              estado.id,
                              estado.nombre,
                              "estado"
                            )
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

      {/**Modal */}
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
                value={nombre}
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
                value={activo}
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
