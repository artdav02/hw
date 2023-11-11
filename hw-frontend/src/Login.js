import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';
import login from './assets/img/login.png'
import {useAuth} from "./auth/AuthContext";

function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
            console.log(response.data);
            setUser({ username, role: response.data.role });
            navigate('/mainPage'); // Navigate after state update
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            alert(error.response.data.message)
        }
    };

    return (
        <div className='container'>
            <div className="mainContent">
                <div className="header">
                    <div className="headerLogo">
                        WebAppDB
                    </div>
                    <div className="signUpButton" onClick={() => navigate('/register')}>
                        Sign up
                    </div>
                </div>
                <div className="mainPart">
                    <div className="leftSide">
                        <div className="loginNow">
                            Login now
                        </div>
                        <div className="welcomeBack">
                            Hey, Welcome back👋
                        </div>
                        <form className="form" onSubmit={handleLogin}>
                            <div className="inputHeader">
                                Username
                            </div>
                            <input type="text" className='inputTarget' placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <div className="inputHeader">
                                Password
                            </div>
                            <input type="password" className='inputTarget' placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="login">
                                <button type="submit" className='loginButton'>Login</button>
                            </div>
                        </form>

                    </div>
                    <div className="rightSide">
                        <img src={login} alt=""/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
