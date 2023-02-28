import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Registration from "./pages/Registration";
import Timeline from "./pages/Timeline";
import Me from "./pages/Me";

function App() {
  return (
    <BrowserRouter>
        {/*<Navbar/> - Budeme pouzivat jeste navigaci pro prochazeni skrze url?*/}
        <Routes>
            <Route path="/" element={<Timeline/>} />
            <Route path="login" element={<Login/>} />
            <Route path="registration" element={<Registration/>} />
            <Route path="me" element={<Me/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
