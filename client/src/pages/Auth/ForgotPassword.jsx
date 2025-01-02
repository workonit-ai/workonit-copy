import React, { useState } from 'react';
import { Button, Step, StepIcon, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import './ResetPass.css';
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { postRequest } from '../../api';
import {environmentUrls} from '../../constants';


const steps = ["Enter Email", "Enter OTP", "Set New Password"];

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [activeStep, setActiveStep] = useState(0);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [resetToken, setResetToken] = useState({});
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const handleReset = () => {
		setActiveStep(0);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleOtpChange = (event) => {
		setOtp(event.target.value);
	};

	// const submitEmail = async (e) => {
	// 	e.preventDefault();
	// 	if (!email) {
	// 		toast.error("Please enter email");
	// 		return;
	// 	}
	// 	if (!emailRegex.test(email)) {
	// 		toast.error("Invalid email format");
	// 		return;
	// 	}

	// 	const res = await toast.promise(
	// 		axios.post(`${import.meta.env.VITE_API_URL}/user/forgot`, {
	// 			email: email,
	// 		}),
	// 		{
	// 			pending: "Validating email...",
	// 			success: {
	// 				render: ({ data }) => {
	// 					return "OTP has been sent.";
	// 				},
	// 				icon: "✅",
	// 			},
	// 			error: {
	// 				render: ({ data }) => {
	// 					print(data);
	// 					// return `${data.response.data.message}`;
	// 				},
	// 				icon: "❌",
	// 			},
	// 		},
	// 		{
	// 			position: "top-left",
	// 		}
	// 	);

	// 	console.log(res);
	// 	handleNext();
	// };

	const submitEmail = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter email");
			return;
		}
		if (!emailRegex.test(email)) {
			toast.error("Invalid email format");
			return;
		}
	
		try {
			const res = await toast.promise(
				axios.post(`${environmentUrls.api_url}/user/forgot`, {
					email: email,
				}),
				{
					pending: "Validating email...",
					success: "OTP has been sent.",
					error: {
						render: ({ data }) => {
							// Check if data and data.response exist before accessing
							return data && data.response ? data.response.data.message : "An error occurred";
						},
					},
				},
				{
					position: "top-left",
				}
			);
	
			console.log(res);
			handleNext();
		} catch (error) {
			console.error("Error in submitEmail:", error);
			// This catch block will handle any errors not caught by toast.promise
			toast.error("An unexpected error occurred. Please try again later.");
		}
	};
	
	const CustomTextField = TextField;

	const submitOtp = async (e) => {
		e.preventDefault();
		try {
			const res = await postRequest(`${import.meta.env.VITE_API_URL}/otp/verify?type=resetpassword`, {
				email: email,
				otp: otp,
			});

			setResetToken(res.data.token);
			console.log(res);
			handleNext();
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message, {
					position: "top-left",
				});
			} else if (err.request) {
				toast.error("Network error.", {
					position: "top-left",
				});
			} else {
				toast.error("An unexpected error occurred. ", {
					position: "top-left",
				});
			}
		}
	};

	const submitPassword = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords must match", {
				position: "top-left",
			});
			return;
		}

		try {
			const res = await postRequest(`${import.meta.env.VITE_API_URL}/user/change-password`, {
				token: resetToken,
				password: password,
			});
			toast.success("Password Changed Successfully!");
			navigate("/login");
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message, {
					position: "top-left",
				});
			} else if (err.request) {
				toast.error("Network error.", {
					position: "top-left",
				});
			} else {
				toast.error("An unexpected error occurred. ", {
					position: "top-left",
				});
			}
		}
	};

	const resendOtp = async () => {
		try {
			const res = await postRequest(`${import.meta.env.VITE_API_URL}/otp/resend`, {
				email: email,
			});

			toast.success("OTP resent", {
				position: "top-left",
			});
		} catch (err) {
			if (err.response) {
				toast.error(err.response.data.message, {
					position: "top-left",
				});
			} else if (err.request) {
				toast.error("Network error.", {
					position: "top-left",
				});
			} else {
				toast.error("An unexpected error occurred. ", {
					position: "top-left",
				});
			}
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<div className="stepper-field">
						<form onSubmit={submitEmail}>
							<CustomTextField
								label="Enter Email"
								variant="outlined"
								type="email"
								fullWidth
								onChange={handleEmailChange}
								value={email}
							/>
						</form>
					</div>
				);
			case 1:
				return (
					<div className="stepper-field">
						<CustomTextField
							type="number"
							label="Enter OTP"
							variant="outlined"
							value={otp}
							fullWidth
							onChange={handleOtpChange}
							onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
						/>
					</div>
				);
			case 2:
				return (
					<>
						<div className="stepper-field">
							<form onSubmit={submitOtp}>
								<CustomTextField
									label="Enter New Password"
									variant="outlined"
									type="password"
									fullWidth
									onChange={(e) => setPassword(e.target.value)}
								/>
							</form>
						</div>
						<div className="stepper-field">
							<form onSubmit={submitPassword}>
								<CustomTextField
									label="Confirm New Password"
									variant="outlined"
									type="password"
									fullWidth
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</form>
						</div>
					</>
				);
			default:
				return "Unknown step";
		}
	};

	const CustomStepIcon = (props) => {
		const { active, completed, icon } = props;
		return <StepIcon icon={icon} sx={{ color: active ? "#10a37f" : completed ? "#10a37f" : "default" }} />;
	};

	return (
		<div className="container active">
			<div className="toggle-container toggle-left">
				<div className="toggle">
					<div className="toggle-panel ">
						<h1>Forgot Password?</h1>
						<br />
						<p>We will send you an OTP on Email just enter it and change your password</p>
						<button className="hidden" id="login" onClick={() => navigate("/login")}>
							Sign In
						</button>
					</div>
				</div>
			</div>
			<div className="form-container sign-up reset-pass">
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel StepIconComponent={(props) => <CustomStepIcon {...props} />}>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<div>
					{activeStep === steps.length ? (
						<div>
							<Typography>Your password has been changed successfully.</Typography>
							<Button onClick={handleReset}>Reset</Button>
						</div>
					) : (
						<div>
							{getStepContent(activeStep)}
							<div className="stepper-btn-container">
								{activeStep === 0 && (
									<Button variant="contained" color="primary" onClick={submitEmail} className="stepper-btn">
										Verify Email
									</Button>
								)}
								{activeStep === 1 && (
									<div className="otp-btns">
										<Button color="primary" onClick={resendOtp} className="resend-otp-button">
											Resend otp
										</Button>
										<Button variant="contained" color="primary" onClick={submitOtp} className="stepper-btn">
											Verify OTP
										</Button>
									</div>
								)}
								{activeStep === 2 && (
									<Button variant="contained" color="primary" onClick={submitPassword} className="stepper-btn">
										Verify Password
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
