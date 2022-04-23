import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const url = 'http://localhost:8000/api/token/';
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthTokens] = useState(null);
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const sendLoginData = async (id, password) => {
        const loginData = {
            email: id,
            password: password,
        };
        const loginState = await axios.post(url, loginData);
        const access = loginState.data.access;
        const refresh = loginState.data.refresh;
        const decode = jwt_decode(access);

        setUser(decode.user_email);
        setLoggedIn(true);
    };
    return <AuthContext.Provider value={{ sendLoginData, loggedIn }}>{children}</AuthContext.Provider>;
};
