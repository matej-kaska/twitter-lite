import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import Login from './pages/Login';
import Registration from "./pages/Registration";
import Timeline from "./pages/Timeline";
import Me from "./pages/Me";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login/>} />
            <Route path="registration" element={<Registration/>} />
            <Route element={<PrivateRoute/>}>
                <Route path="/" element={<Timeline/>} />
                <Route path="me" element={<Me/>} />
                <Route path="profile/:user_id" element={<Profile/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
