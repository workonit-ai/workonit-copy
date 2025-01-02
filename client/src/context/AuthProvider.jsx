import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const getJWT = () => {
		return Cookies.get("jwt"); // Use consistent key "jwt" for Cookies
	};

	useEffect(() => {
		const storedIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
		const storedUser = JSON.parse(localStorage.getItem("user"));
		const token = getJWT();
		if (storedIsLoggedIn && storedUser && token) {
			setIsLoggedIn(storedIsLoggedIn); // No need to parse here
			setUser(storedUser); // No need to parse here
		}
	}, []);

	const login = (user, jwt) => {
		setIsLoggedIn(true);
		setUser(user);
		Cookies.set("jwt", jwt); // Use consistent key "jwt" for Cookies
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("isLoggedIn", true); // Store boolean directly, not as a string
		localStorage.setItem("token", jwt);
	};

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);
		Cookies.remove("jwt"); // Use consistent key "jwt" for Cookies
		localStorage.removeItem("user");
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("token");
	};

	// ...

	return <AuthContext.Provider value={{ user, isLoggedIn, login, logout, getJWT }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { AuthProvider, useAuth };
