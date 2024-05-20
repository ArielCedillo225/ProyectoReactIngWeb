import React, { useEffect, useState } from "react";
import CustomInput from "./ComponentesMenores/CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import BotonHipervinculo from "./ComponentesMenores/BotonHipervinculo";
import * as ApiAriel from "./Funciones/ComsumoApi";
import ValidarPrestamo from "./Funciones/ValidarPrestamo";
import ValidacionDevolucion from "./Funciones/ValidarDevolucion";
import HeaderTabla from "./ComponentesMenores/HeaderTabla";
import CamposPrestamo from "./Campos/CamposPrestamo";
import Modal from "./ComponentesMenores/Modal";

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

  /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */

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
  }, [url]);

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
    var vMetodo;
    var vURL;
    var vParametros = ValidarPrestamo(
      cliente,
      producto,
      fechaDevolucion,
      cantidad
    );

    if (vParametros) {
      vMetodo = "POST";
      vURL = url + "/Insertar";

      ApiAriel.Consumir(vMetodo, vParametros, vURL);
    }
  };
  const validarDevolucion = () => {
    var vMetodo;
    var vURL;

    var vParametros = ValidacionDevolucion(id, parcial, cantidad);

    if (vParametros) {
      vMetodo = "POST";
      vURL = url + "/Devolver";
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
                data-bs-target="#modal-prestamo"
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
                <HeaderTabla data={CamposPrestamo} />

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
      <Modal id="modal-prestamo" title="Agregar Prestamo">
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
          <button className="btn btn-success" onClick={() => validarCampos()}>
            <i className="fa-solid fa-floppy-disck"></i>
            Guardar
          </button>
        </div>
      </Modal>
      {/*Modal devolucion*/}
      <Modal id="modal-devolver" title="Agregar Prestamo">
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
      </Modal>
      <BotonHipervinculo link="/clientes" mensaje="Ir a Clientes" />
    </div>
  );
};
export default PrestamoComponente;
