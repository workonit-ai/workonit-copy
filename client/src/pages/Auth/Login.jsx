import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';
import { postRequest } from '../../api';
import './Auth.css';
import { useAuth } from '../../context/AuthProvider';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Signup from './Signup';
import { ClipLoader } from 'react-spinners';

const Login = ({ setShowModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [signUpModal, setSignUpModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const { login } = useAuth();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const clearForm = () => {
		setEmail("");
		setPassword("");
	};

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
			setShowModal(false);
			login(res.data.user, res.data.user.token);
			toast.success("Login Successful", {
				autoClose: 2000,
			});
			if (res.data.user.role === "admin") {
				console.log("admin");
				navigate("/dashboard");
			}

			clearForm();
		} catch (err) {
			setIsLoading(false);
			console.log(err);
			toast.error(err.response.data.message);
		}
	};

	return (
		<div className="login__container">
			<Modal open={signUpModal} onClose={() => setShowModal(false)}>
				<div className="modal__login">
					<Signup setSignUpModal={setSignUpModal} />
				</div>
			</Modal>

			<div className="login__text">
				<h2>Welcome Back</h2>
				<p style={{ letterSpacing: "1px" }}>Log in to WorkOnIt to continue to Apps Client.</p>
			</div>
			<form onSubmit={handleSubmit}>
				<Stack>
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
				</Stack>

				{/* <Button onClick={signIn}>Sign In with Google</Button> */}
				<Button type="submit">{isLoading ? <ClipLoader size={17} color="white" /> : "Sign In"}</Button>
				<Link to="/forgot-password">Forgot Password?</Link>
				<div className="signup-text">
					Don't have an account?{" "}
					<span
						className="signup__link"
						onClick={() => {
							setSignUpModal(true);
						}}>
						Sign Up
					</span>
				</div>
			</form>
		</div>
	);
};

export default Login;
