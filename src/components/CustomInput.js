import React from "react";

function CustomInput(props) {
  return (
    <div className="input-group mb-3">
      <span className="inputgroup-text">
        <i className="fa-solid fa-gift"></i>
      </span>
      <input
        type="text"
        id={props.id}
        className="form-control"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      ></input>
    </div>
  );
}

export default CustomInput;
