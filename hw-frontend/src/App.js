import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Login';
import MainPage from './MainPage';
import RegisterPage from './Register';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from "./auth/AdminRoute";
import { AuthProvider, useAuth } from './auth/AuthContext';
import ListOfUsers from "./ListOfUsers";

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
                <Route
                    path="/listOfUsers"
                    element={
                        <AdminRoute>
                            <ListOfUsers />
                        </AdminRoute>
                    }
                />
                <Route
                    path="*"
                    element={user ? <Navigate to="/mainPage" /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default AppWrapper;
