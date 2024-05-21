const TablaDatos = ({ style, children }) => {
  return (
    <div className="row mt-3">
      <div className={style}>
        <div className="table responsive">
          <table className="table table-bordered">{children}</table>
        </div>
      </div>
    </div>
  );
};

export default TablaDatos;
