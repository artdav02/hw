import React from 'react';
import axios from 'axios';
import CipherTool from "./CipherTool";
import './App.css'
import Navbar from "./Navbar";

axios.defaults.withCredentials = true;

function MainPage() {


    return (
        <div className="main-page-container">
            <Navbar></Navbar>
            <CipherTool></CipherTool>
        </div>
    );
}

export default MainPage;
