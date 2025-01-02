import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthProvider';
import { failureToaster, successToaster } from '../../../utils/swal.js';
import { postRequest } from '../../../api';

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [loading, setIsLoading] = useState(false);
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const clearForm = () => {
		setEmail("");
		setPassword("");
	};

	useEffect(() => {
		let user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			navigate("/dashboard");
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setEmailError(false);
		setPasswordError(false);

		if (!email) {
			toast.error("Email is missing");
			setEmailError(true);
		}
		if (!password) {
			toast.error("Password is missing");
			setPasswordError(true);
			return;
		}

		if (!emailRegex.test(email)) {
			toast.error("Invalid email format");
			setEmailError(true);
			return;
		}

		setIsLoading(true);
		try {
			const res = await postRequest(`/user/login`, {
				email: email,
				password: password,
			});
			setIsLoading(false);
			login(res.data.user, res.data.user.token);
			successToaster("Login Successful");
			navigate("/dashboard");
			clearForm();
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			failureToaster(err.response.data.message);
		}
	};

	return (
		<div className="container">
			<div className="form-container sign-in">
				<form onSubmit={handleSubmit}>
					<h1>Sign In</h1>
					<TextField
						type="text"
						name="email"
						value={email}
						id="login-email"
						onChange={(e) => setEmail(e.target.value)}
						label="Enter Email"
						variant="outlined"
						className="input"
						error={emailError}
					/>
					<TextField
						type="password"
						name="password"
						id="login-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						min={6}
						label="Enter Pasword"
						variant="outlined"
						error={passwordError}
						className="input"
					/>
					<button type="submit" onClick={handleSubmit}>
						Sign In
					</button>
					{/* <span className="signup-text">
						Don't have an account? <Link to="/signup">Sign Up</Link>
					</span> */}
				</form>
			</div>
			<div className="toggle-container">
				<div className="toggle">
					<div className="toggle-panel toggle-right">
						{/* <img src={Logo} width={100} alt="" /> */}
						<h1>Welcome Back!</h1>
						<p>Sign in to your Dashboard</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
