import ModalFooter from "./ModalFooter";

const Modal = ({ id, title, children }) => {
  return (
    <div id={id} className="modal fade" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <label className="h5">{title}</label>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <input type="hidden" id="id"></input>
            {children}
            <ModalFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
