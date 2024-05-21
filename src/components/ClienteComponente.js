import React, { useEffect, useState } from "react";

import CustomInput from "./ComponentesMenores/CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import * as ApiAriel from "./Funciones/ComsumoApi";

import BotonHipervinculo from "./ComponentesMenores/BotonHipervinculo";
import ValidarCliente from "./Funciones/ValidarCliente";
import CamposCliente from "./Campos/CamposCliente";
import HeaderTabla from "./ComponentesMenores/HeaderTabla";
import Modal from "./ComponentesMenores/Modal";
import BotonAgregar from "./ComponentesMenores/BotonAgregar";
import TablaDatos from "./ComponentesMenores/TablaDatos";
import BotonValidar from "./ComponentesMenores/BotonValidar";

const ClienteComponente = () => {
  const bUrl = "http://localhost:8080/";
  const apiUsada = "Cliente";
  const url = bUrl + apiUsada;

  const [Clientes, setClientes] = useState([]);
  const [nombres, setNombres] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  {
    /*Aqui se usa fetchData solo para cargar la primera vez porque el useEffect no puede ser async */
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiAriel.Listar(url);
        setClientes(data);
      } catch (error) {
        console.error("Error al listar los prestamos:", error);
      }
    };

    fetchData();
  }, [url]);

  const Listar = async () => {
    const data = await ApiAriel.Listar(url);
    setClientes(data);
  };

  const aperturaModal = () => {
    setNombres("");
    setIdentificacion("");
    setDireccion("");
    setTelefono("");
    setCorreo("");
    window.setTimeout(() => {
      document.getElementById("nombres").focus();
    }, 500);
  };

  const validarCampos = () => {
    var vMetodo;
    var vURL;
    var vParametros;

    vParametros = ValidarCliente(
      nombres,
      identificacion,
      direccion,
      telefono,
      correo,
      fechaNacimiento
    );

    if (vParametros) {
      vMetodo = "POST";
      vURL = url + "/Registrar";

      ApiAriel.Consumir(vMetodo, vParametros, vURL);
    }
  };

  const activarEstado = (pIdentificacion) => {
    var vParametros;
    var vMetodo;
    var vURL;

    vParametros = {
      identificacion: pIdentificacion,
    };
    vMetodo = "POST";
    vURL = url + "/ActualizarEstado";

    ApiAriel.Consumir(vMetodo, vParametros, vURL);
  };

  return (
    <div className="app">
      <div className="container-fluid">
        <BotonAgregar
          modalTarget="#modal-cliente"
          title="Agregar Cliente"
          onClick={() => aperturaModal()}
        />

        <TablaDatos style="col-6 col-lg-9 offset-0 offset-lg-1">
          <HeaderTabla data={CamposCliente} />

          <tbody className="table-group-divider">
            {Clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.identificacion}</td>
                <td>{cliente.tipoIdentificacion}</td>
                <td>{cliente.nombrePrincipal}</td>
                <td>{cliente.nombreSecundario}</td>
                <td>{cliente.apellidoPaterno}</td>
                <td>{cliente.apellidoMaterno}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.fechaNacimiento}</td>
                <td>{cliente.fechaCreacion}</td>
                <td>{cliente.estado}</td>
                <td>
                  {cliente.estado === 2 ? (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        activarEstado(cliente.identificacion);
                      }}
                    >
                      <i className="fa-solid fa-check "></i>
                    </button>
                  ) : (
                    <div>
                      <p>Activo</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TablaDatos>
      </div>

      {/**Modal */}
      <Modal id="modal-cliente" title="Agregar Cliente">
        <CustomInput
          id="identificacion"
          placeholder="Identificación"
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
        />
        <CustomInput
          id="nombres"
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
        <CustomInput
          id="direccion"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <CustomInput
          id="telefono"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <CustomInput
          id="correo"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <CustomInput
          id="fechaNacimiento"
          placeholder="Fecha de Nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />

        <BotonValidar onClick={() => validarCampos()} />
      </Modal>
      <BotonHipervinculo link="/" mensaje="Ir a Prestamos" />
    </div>
  );
};

export default ClienteComponente;
