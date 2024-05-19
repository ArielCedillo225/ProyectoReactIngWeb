import React from "react";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  return `${year}-${month}-${day}`;
};

export default getCurrentDate();
