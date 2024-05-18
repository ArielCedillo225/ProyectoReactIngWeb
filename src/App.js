import { BrowserRouter, Route, Routes } from "react-router-dom";
import EstadoComponente from "./components/EstadoComponente";
import PrestamoComponente from "./components/PrestamoComponente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrestamoComponente />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
