const checkArroba = (pCorreo) => {
  const checkArroba = "@";
  const posicionArroba = pCorreo.indexOf(checkArroba);

  if (posicionArroba > 0 && posicionArroba < pCorreo.length - 1) {
    return true;
  } else return false;
};

export default checkArroba;
