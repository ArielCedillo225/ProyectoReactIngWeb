const BotonAgregar = (props) => {
  return (
    <div className="row mt-3">
      <div className="col-md-4 offset-md-4">
        <div className="d-grid mx-auto">
          <button
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target={props.modalTarget}
            onClick={props.onClick}
          >
            <i className="fa-solid facircle-plus">{props.title}</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotonAgregar;
