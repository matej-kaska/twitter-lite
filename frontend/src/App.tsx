import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Registration from "./pages/Registration";

function App() {
  return (
    <BrowserRouter>
        {/*<Navbar/> - Budeme pouzivat jeste navigaci pro prochazeni skrze url?*/}
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="login" element={<Login/>} />
            <Route path="registration" element={<Registration/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
