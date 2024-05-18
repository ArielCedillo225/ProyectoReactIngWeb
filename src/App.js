import { BrowserRouter, Route, Routes } from "react-router-dom";
import EstadoComponente from "./components/EstadoComponente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EstadoComponente></EstadoComponente>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
