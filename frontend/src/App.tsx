import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import Login from './pages/Login';
import Registration from "./pages/Registration";
import Timeline from "./pages/Timeline";
import Me from "./pages/Me";
import Profile from "./pages/Profile";
import Tweet from "./pages/Tweet";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="login" element={<Login/>} />
            <Route path="registration" element={<Registration/>} />
            <Route element={<PrivateRoute/>}>
                <Route path="/" element={<Timeline/>} />
                <Route path="me" element={<Me/>} />
                <Route path="profile/:user_id" element={<ProfileWrapper/>}/>
                <Route path="tweet/:tweet_id" element={<TweetWrapper/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

function ProfileWrapper() {
  const { user_id } = useParams();
  return <Profile key={user_id} />;
}

function TweetWrapper() {
  const { tweet_id } = useParams();
  return <Tweet key={tweet_id} />;
}

export default App;
