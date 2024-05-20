import React from "react";

const HeaderTabla = ({ data }) => {
  return (
    <thead>
      <tr>
        {data.map((campo, index) => (
          <th key={index}>{campo}</th>
        ))}
      </tr>
    </thead>
  );
};

export default HeaderTabla;
