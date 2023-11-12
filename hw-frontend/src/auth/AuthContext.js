import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/checkAuth', { withCredentials: true })
            .then(response => {
                if (response.data.isAuthenticated) {
                    setUser(response.data.user);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Auth check failed:', error);
                setIsLoading(false);
            });
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
