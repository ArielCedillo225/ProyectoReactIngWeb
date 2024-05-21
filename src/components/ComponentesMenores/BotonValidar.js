const BotonValidar = (props) => {
  return (
    <div className="d-grid col-6 mx-auto">
      <button className="btn btn-success" onClick={props.onClick}>
        <i className="fa-solid fa-floppy-disck"></i>
        Guardar
      </button>
    </div>
  );
};

export default BotonValidar;
