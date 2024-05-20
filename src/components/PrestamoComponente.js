import React, { useEffect, useState } from "react";
import { alerta } from "../utils";
import CustomInput from "./ComponentesMenores/CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import BotonHipervinculo from "./ComponentesMenores/BotonHipervinculo";
import * as ApiAriel from "./Funciones/ComsumoApi";

import fechaActual from "./Funciones/FechaActual";

const PrestamoComponente = () => {
  const bUrl = "http://localhost:8080/";
  const apiUsada = "Prestamo";
  const url = bUrl + apiUsada;

  const [Prestamos, setPrestamos] = useState([]);
  const [id, setId] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [parcial, setParcial] = useState(0);
  const [titulo, setTitulo] = useState("");
  {
    /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiAriel.Listar(url);
        setPrestamos(data);
      } catch (error) {
        console.error("Error al listar los prestamos:", error);
      }
    };

    fetchData();
  }, []);

  const aperturaModal = () => {
    setCliente("");
    setProducto("");
    setFechaDevolucion("");
    setCantidad(0);
    setTitulo("Registrar nuevo prestamo");
    window.setTimeout(() => {
      document.getElementById("cliente").focus();
    }, 500);
  };

  const aperturaModalDevolucion = (pId) => {
    setId(pId);
    setParcial(0);
    setCantidad(0);
    window.setTimeout(() => {
      document.getElementById("parcial").focus();
    }, 500);
  };

  const validarCampos = () => {
    var vParametros;
    var vMetodo;
    var vURL;
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
    } else if (cantidad == 0) {
      alerta("La cantidad debe ser mayor a cero", "warning");
    } else if (!datePattern.test(fechaDevolucion)) {
      alerta("El formato del campo debe ser AAAA-MM-DD", "warning");
    } else if (fDevolucion > fechaMaxima) {
      alerta("La fecha de devolución debe ser antes del 2025-01-01", "warning");
    } else if (fDevolucion <= fActual) {
      alerta("La fecha de devolución debe mayor a la fecha actual", "warning");
    } else {
      vParametros = {
        cliente: cliente,
        producto: producto,
        fechaDevolucion: fechaDevolucion,
        cantidad: cantidad,
      };
      vMetodo = "POST";
      vURL = url + "/Insertar";

      ApiAriel.Consumir(vMetodo, vParametros, vURL);
    }
  };

  const validarDevolucion = () => {
    var vParametros;
    var vMetodo;
    var vURL;
    var regex = /^[0-9]+$/;

    if (parcial < 0 && parcial > 1) {
      alerta("El parcial solo puede ser 0 o 1", "warning");
    } else if (!regex.test(cantidad)) {
      alerta("Ingrese solo números en el campo cantidad", "warning");
    } else {
      vParametros = {
        id: id,
        parcial: parcial,
        cantidad: cantidad,
      };
      vMetodo = "POST";
      vURL = url + "/Devolver";
      console.log(vParametros);
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
                onClick={() => aperturaModal()}
              >
                <i className="fa-solid facircle-plus">Agregar</i>
              </button>
              <button
                onClick={() => excelDownload(Prestamos, "Prestamos")}
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
                    <th>Devolver</th>
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
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#modal-devolver"
                          onClick={() => aperturaModalDevolucion(prestamo.id)}
                        >
                          <i className="fa-solid fa-check"></i>
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
      {/**Modal agregar*/}
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
      {/*Modal devolucion*/}
      <div id="modal-devolver" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">Devolver Producto</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <input id="id" hidden={true}></input>
              <CustomInput
                id="parcial"
                placeholder="Parcial"
                value={parcial}
                onChange={(e) => setParcial(e.target.value)}
                texto="Parcial"
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
                  onClick={() => validarDevolucion()}
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
      <BotonHipervinculo link="/clientes" mensaje="Ir a Clientes" />
    </div>
  );
};

export default PrestamoComponente;
