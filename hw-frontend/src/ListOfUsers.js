import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import './App.css'

function ListOfUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/listOfUsers', { withCredentials: true })
            .then(response => {
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='listContainer'>
            <Navbar></Navbar>
            <div className='userLogo'>User List</div>
            <table className='userTable'>
                <thead className='userHeader'>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Username (Caesar)</th>
                    <th>Username (Vigenere)</th>
                    <th>Password (Bcrypt)</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.userID} className='userRow'>
                        <td className='padding'>{user.userID}</td>
                        <td>{user.username}</td>
                        <td>{user.usernameCaesar}</td>
                        <td>{user.usernameVigenere}</td>
                        <td>{user.password}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListOfUsers;
