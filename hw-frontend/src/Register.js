import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'
import login from "./assets/img/login.png";
function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', { username, password }, { withCredentials: true });
            console.log(response.data);
            navigate('/mainPage');
        } catch (error) {
            console.error(error.response.data);
            alert(error.response.data.message)
        }
    };

    return (
        <div className='containerCentred'>
            <div className="mainContentCentred">
                <div className="headerCentred">
                    <div className="headerLogo">
                        WebAppDB
                    </div>
                </div>
                <div className="mainPart">
                    <div className="leftSide">
                        <div className="loginNow">
                            Register
                        </div>
                        <div className="welcomeBack">
                            Hey, Welcome to our team👋
                        </div>
                        <form className="form" onSubmit={handleRegister}>
                            <div className="inputHeader">
                                Username
                            </div>
                            <input type="text" className='inputTarget' placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <div className="inputHeader">
                                Password
                            </div>
                            <input type="password" className='inputTarget' placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="login">
                                <button type="submit" className='loginButton'>Register</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
