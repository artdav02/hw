import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true; // Important: this will allow cookies to be sent

function MainPage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // No need to send session ID, as it should be handled by cookies
            await axios.post('http://localhost:5000/logout');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle error, possibly by showing a message to the user
        }
    };

    return (
        <div className="main-page-container">
            <h1>Main Page</h1>
            {/* Additional main page content goes here */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default MainPage;
