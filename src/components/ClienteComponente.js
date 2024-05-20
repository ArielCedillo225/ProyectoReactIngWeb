import React, { useEffect, useState } from "react";
import { alerta } from "../utils";
import CustomInput from "./CustomInput";
import excelDownload from "./Funciones/ExportarExcel";
import * as ApiAriel from "./Funciones/ComsumoApi";
import checkArroba from "./Funciones/CheckCorreo";

import fechaActual from "./Funciones/FechaActual";

const ClienteComponente = () => {
  const bUrl = "http://localhost:8080/";
  const apiUsada = "Cliente";
  const url = bUrl + apiUsada;

  const [Clientes, setClientes] = useState([]);
  const [id, setId] = useState("");
  const [nombres, setNombres] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [estado, setEstado] = useState("");
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
  }, []);

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
    var vParametros;
    var vMetodo;
    var vURL;
    var fNacimiento = new Date(fechaNacimiento);
    var fActual = new Date(fechaActual);

    var regex = /^[0-9]+$/;
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!regex.test(identificacion)) {
      alerta("Ingrese solo números en el campo identificacion", "warning");
    } else if (nombres.trim() === "") {
      alerta("Ingrese valores en el nombre", "warning");
    } else if (direccion.trim() === "") {
      alerta("Ingrese valores en la direccion", "warning");
    } else if (!regex.test(telefono)) {
      alerta("Ingrese solo números en el campo telefono", "warning");
    } else if (!datePattern.test(fechaNacimiento)) {
      alerta("El formato del campo debe ser AAAA-MM-DD", "warning");
    } else if (!checkArroba(correo)) {
      alerta(
        "El correo debe contener una arroba que se encuentre entre el texto",
        "warning"
      );
    } else if (fNacimiento >= fActual) {
      alerta(
        "La fecha de nacimiento debe ser menor a la fecha actual",
        "warning"
      );
    } else {
      vParametros = {
        nombres: nombres,
        identificacion: identificacion,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        fechaNacimiento: fechaNacimiento,
      };
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
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modal-cliente"
                onClick={() => aperturaModal()}
              >
                <i className="fa-solid facircle-plus">Agregar Cliente</i>
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0">
            <div className="table responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Identificación</th>
                    <th>Tipo Identificación</th>
                    <th>Nombre Principal</th>
                    <th>Nombre Secundario</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Fecha Nacimiento</th>
                    <th>Fecha Creación</th>
                    <th>Estado</th>
                    <th>Activar</th>
                  </tr>
                </thead>

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
              </table>
            </div>
          </div>
        </div>
      </div>

      {/**Modal */}
      <div id="modal-cliente" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">Agregar Cliente</label>
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
      <a href="/">
        <button className="btn btn-dark offset-8">
          <i className="fa-solid facircle-plus">Ir a Prestamos</i>
        </button>
      </a>
    </div>
  );
};

export default ClienteComponente;
