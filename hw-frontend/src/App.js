// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Login'; // Your login component
import MainPage from './MainPage'; // Your main page component
import RegisterPage from './Register'; // Your register component
import ProtectedRoute from './auth/ProtectedRoute'; // Your protected route component
import { AuthProvider, useAuth } from './auth/AuthContext'; // Your auth context

const AppWrapper = () => {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

const App = () => {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/mainPage"
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
                {/* Redirect users to /login if not authenticated */}
                <Route
                    path="*"
                    element={user ? <Navigate to="/mainPage" /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default AppWrapper;
