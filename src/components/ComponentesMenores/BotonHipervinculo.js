const BotonHipervinculo = (props) => {
  return (
    <div>
      <a href={props.link}>
        <button className="btn btn-dark offset-8">
          <i className="fa-solid facircle-plus">{props.mensaje}</i>
        </button>
      </a>
    </div>
  );
};

export default BotonHipervinculo;
