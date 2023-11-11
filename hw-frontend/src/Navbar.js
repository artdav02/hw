import React from "react";
import './App.css'
import {useAuth} from "./auth/AuthContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Navbar = () =>{

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (

        <>
            <div className="navbar">
                <div className='mainPageLogo'>Main Page</div>
                <button onClick={() => navigate('/mainPage')} className='logoutButton'>Cipher</button>
                {user && user.role === 'admin' && (
                    <button className='logoutButton' onClick={() => navigate('/listOfUsers')}>
                        View Users
                    </button>
                )}
                <button onClick={handleLogout} className='logoutButton'>Logout</button>
            </div>
        </>

    );

};

export default Navbar;