import React, { PureComponent, act, useEffect, useState } from "react";
import { alerta } from "../utils";
import CustomInput from "./CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import * as ApiAriel from "./Funciones/ComsumoApi";

import fechaActual from "./Funciones/FechaActual";

const PrestamoComponente = () => {
  const bUrl = "http://localhost:8080/";
  const apiUsada = "Prestamo";
  const url = bUrl + apiUsada;

  const [Prestamos, setPrestamos] = useState([]);
  const [id, setId] = useState("");
  const [estado, setEstado] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState(fechaActual);
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [operacion, setOperacion] = useState("");

  {
    /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiAriel.Listar(url);
        setPrestamos(data);
        console.log(data);
      } catch (error) {
        console.error("Error al listar los prestamos:", error);
      }
    };

    fetchData();
  }, []);

  const aperturaModal = (
    pOperacion,
    pId,
    pEstado,
    pCliente,
    pProducto,
    pFechaCreacion,
    pFechaDevolucion,
    pCantidad
  ) => {
    setId("");
    setEstado("");
    setCliente("");
    setProducto("");
    setFechaCreacion(fechaActual);
    setFechaDevolucion("");
    setCantidad(0);
    setOperacion(pOperacion);
    if (pOperacion === 1) {
      setTitulo("Registrar nuevo prestamo");
    } else if (pOperacion === 2) {
      setTitulo("Editar prestamo");
      setId(pId);
      setEstado(pEstado);
      setCliente(pCliente);
      setProducto(pProducto);
      setFechaCreacion(pFechaCreacion);
      setFechaDevolucion(pFechaDevolucion);
      setCantidad(pCantidad);
    }
    window.setTimeout(() => {
      document.getElementById("estado").focus();
    }, 500);
  };

  const validarCampos = () => {
    var vParametros;
    var vMetodo;
    var vURL;
    var fechaMaxima = new Date("2025,1,1");
    var fDevolucion = new Date(fechaDevolucion);

    var regex = /^[0-9]+$/;
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!regex.test(estado)) {
      alerta("Ingrese solo números en este campo", "warning");
    } else if (!regex.test(cliente)) {
      alerta("Ingrese solo números en este campo", "warning");
    } else if (!regex.test(producto)) {
      alerta("Ingrese solo números en este campo", "warning");
    } else if (!datePattern.test(fechaDevolucion)) {
      alerta("El formato del campo debe ser AAAA-MM-DD", "warning");
    } else if (fDevolucion > fechaMaxima) {
      alerta("La fecha de devolución debe ser antes del 2025-01-01", "warning");
    } else {
      if (operacion === 1) {
        vParametros = {
          estado: estado,
          cliente: cliente,
          producto: producto,
          fechaDevolucion: fechaDevolucion,
          cantidad: cantidad,
        };
        vMetodo = "POST";
        vURL = url + "/Insertar";
      } else {
        vParametros = {
          id: id,
          estado: estado,
          cliente: cliente,
          producto: producto,
          fechaDevolucion: fechaDevolucion,
          cantidad: cantidad,
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
                onClick={() => excelDownload(Prestamos)}
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
                    <th>Id Cliente</th>
                    <th>Id Producto</th>
                    <th>Fecha de Creacion</th>
                    <th>Fecha de Devolucion</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>

                <tbody className="table-group-divider">
                  {Prestamos.map((prestamo, id) => (
                    <tr key={prestamo.id}>
                      <td>{prestamo.id}</td>
                      <td>{prestamo.estado}</td>
                      <td>{prestamo.cliente}</td>
                      <td>{prestamo.producto}</td>
                      <td>{prestamo.fechaCreacion}</td>
                      <td>{prestamo.fechaDevolucion}</td>
                      <td>{prestamo.cantidad}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          data-bs-toggle="modal"
                          data-bs-target="#modalprestamo"
                          onClick={() =>
                            aperturaModal(
                              2,
                              prestamo.id,
                              prestamo.estado,
                              prestamo.cliente,
                              prestamo.producto,
                              prestamo.fechaCreacion,
                              prestamo.fechaDevolucion,
                              prestamo.cantidad
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
                              prestamo.estado,
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
              <CustomInput
                id="estado"
                placeholder="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                texto="Estado"
              />
              <CustomInput
                id="cliente"
                placeholder="Cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                texto="Cliente"
              />
              <CustomInput
                id="producto"
                placeholder="Producto"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                texto="Producto"
              />
              <CustomInput
                id="fechaCreacion"
                placeholder="Fecha Creacion"
                value={fechaCreacion}
                onChange={(e) => setFechaCreacion(e.target.value)}
                texto="Fecha Creacion"
                readOnly={true}
              />
              <CustomInput
                id="fechaDevolucion"
                placeholder="Fecha Devolucion"
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.target.value)}
                texto="Fecha Devolucion"
              />
              <CustomInput
                id="cantidad"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                texto="Cantidad"
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
