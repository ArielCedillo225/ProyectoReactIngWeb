import React, { PureComponent, act, useEffect, useState } from "react";
import { alerta } from "../utils";
import CustomInput from "./CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import * as ApiAriel from "./Funciones/ComsumoApi";

const PrestamoComponente = () => {
  const bUrl = "http://localhost:8080/";
  const apiUsada = "Prestamo";
  const url = bUrl + apiUsada;

  const [Prestamos, setPrestamos] = useState([]);
  const [id, setId] = useState("");
  const [estado, setEstado] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [titulo, setTitulo] = useState("");

  {
    /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiAriel.Listar(url);
        setprestamos(data);
      } catch (error) {
        console.error("Error al listar los prestamos:", error);
      }
    };

    fetchData();
  }, []);

  //   const aperturaModal = (pOperacion, pId, pNombre, pDescripcion, pActivo) => {
  //     setId("");
  //     setNombre("");
  //     setDescripcion("");
  //     setActivo("");
  //     setOperacion(pOperacion);
  //     if (pOperacion === 1) {
  //       setTitulo("Registrar nuevo prestamo");
  //     } else if (pOperacion === 2) {
  //       setTitulo("Editar prestamo");
  //       setId(pId);
  //       setNombre(pNombre);
  //       setDescripcion(pDescripcion);
  //       setActivo(pActivo);
  //     }
  //     window.setTimeout(() => {
  //       document.getElementById("nombre").focus();
  //     }, 500);
  //   };

  const validarCampos = () => {
    var vParametros;
    var vMetodo;
    var vURL;

    console.log(activo);
    if (nombre.trim() === "") {
      alerta("No se ha ingresado un nombre para el prestamo", "warning");
    } else if (descripcion.trim() === "") {
      alerta("No se ha ingresado una descripcion para el prestamo", "warning");
    } else if (String(activo).trim() === "") {
      alerta("No se indicado si ese prestamo se encuentra activo", "warning");
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
                data-bs-target="#modalprestamo"
                onClick={() => aperturaModal(1)}
              >
                <i className="fa-solid facircle-plus">Agregar</i>
              </button>
              <button
                onClick={() => excelDownload(prestamos)}
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
                    <th>Id Estado</th>
                    <th>Id Producto</th>
                    <th>Fecha de Creacion</th>
                    <th>Fecha de Devolucion</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {prestamos.map((prestamo, id) => (
                    <tr key={prestamo.id}>
                      <td>{prestamo.id}</td>
                      <td>{prestamo.nombre}</td>
                      <td>{prestamo.descripcion}</td>
                      <td>{prestamo.activo}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalprestamo"
                          onClick={() =>
                            aperturaModal(
                              2,
                              prestamo.id,
                              prestamo.nombre,
                              prestamo.descripcion,
                              prestamo.activo
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
                              prestamo.id,
                              prestamo.nombre,
                              "prestamo"
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
      <div id="modalprestamo" className="modal fade" aria-hidden="true">
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

export default PrestamoComponente;
