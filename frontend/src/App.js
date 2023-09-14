import './App.css';
import "./styles/main.css";
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Navbar} from "./components/navbar/Navbar";
import {Map2} from './pages/Map'
import {Footer} from "./components/footer/Footer";
import {Register} from "./pages/Register";
import {Login} from "./pages/Login";
import {Profile} from "./pages/Profile";
import {AddNewBallon} from "./pages/AddNewBallon";
import {Contacts} from "./pages/Contacts";
import {getUser} from "./services/auth.service";

function App() {
    const [first, setFirst] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState({
        "id": 100000,
        "email": "",
        "isConfirmed": 0,
        "phone": "",
        "fullName": "",
        "company": ""
    });

    useEffect(() => {
        if(!first){
            if(localStorage.getItem('token')){
                const res = getUser();
                res.then(data => {
                    setIsAuth(true);
                    setUser(data?.data?.decoded);
                    setFirst(true)
                })
            }
        }

    }, [first, isAuth, user])
    return (
    <div className="App">
        <Router>
            <Navbar isAuth={isAuth} setIsAuth={setIsAuth}/>
            <Routes>
                <Route path="/" element={<Map2 isAuth={isAuth} />} />
                <Route path="/register" element={<Register isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/login" element={<Login isAuth={isAuth} setIsAuth={setIsAuth} setUser={setUser}/>} />
                <Route path="/profile" element={<Profile isAuth={isAuth} setIsAuth={setIsAuth} user={user} />} />
                <Route path="/add-new-ballon" element={<AddNewBallon isAuth={isAuth} setIsAuth={setIsAuth} />} />
                <Route path="/contacts" element={<Contacts isAuth={isAuth} setIsAuth={setIsAuth} />} />
            </Routes>
            <Footer />
        </Router>
    </div>
    );
}

export default App;
