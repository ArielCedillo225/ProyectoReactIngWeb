import React from "react";

function CustomInput(props) {
  return (
    <div className="input-group mb-3">
      <span className="inputgroup-text">
        <label>{props.texto}</label>
      </span>
      <input
        type="text"
        id={props.id}
        className="form-control"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        readOnly={props.readOnly ? true : false}
        display={props.readOnly ? "block" : "none"}
      ></input>
    </div>
  );
}

export default CustomInput;
