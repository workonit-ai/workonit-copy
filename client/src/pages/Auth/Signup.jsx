import React, { useState } from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { environmentUrls } from "../../constants/urls";
import { successToaster } from "../../utils/swal";

const Signup = ({ setSignUpModal, companyName, companyId, role }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState({
    nameError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
  });

  const resetError = () => {
    setFormError((prevState) => ({
      ...prevState,
      nameError: false,
      emailError: false,
      passwordError: false,
      confirmPasswordError: false,
    }));
  };
  const { nameError, emailError, passwordError, confirmPasswordError } =
    formError;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword({
      value: "",
      isTouched: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formError);
    resetError();
    console.log(formError);

    if (!name) {
      setFormError((prevState) => ({ ...prevState, nameError: true }));
    }
    if (!email) {
      setFormError((prevState) => ({ ...prevState, emailError: true }));
    }
    if (email != "" && !emailRegex.test(email)) {
      setFormError((prevState) => ({ ...prevState, emailError: true }));
      toast.error("Invalid email format", {
        position: "top-left",
      });
      return;
    }

    if (!password) {
      setFormError((prevState) => ({ ...prevState, passwordError: true }));
    }
    if (!confirmPassword) {
      setFormError((prevState) => ({
        ...prevState,
        confirmPasswordError: true,
      }));
    }

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Some fields are missing", {
        position: "top-left",
      });
      return;
    }

    if (password.length < 5) {
      setFormError((prevState) => ({ ...prevState, passwordError: true }));
      toast.error("Password must be greater then 5 characters", {
        position: "top-left",
      });

      return;
    }

    if (password !== confirmPassword) {
      setFormError((prevState) => ({
        ...prevState,
        confirmPasswordError: true,
      }));
      toast.error("Passwords must match", {
        position: "top-left",
      });
      return;
    }

    axios
      .post(`/user/signup`, {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        // navigate("/signup-otp", { state: { email: email } });

        console.log("Company Name and Company Id");
        console.log(companyName, companyId);
        console.log(res);
        if (companyName && companyId) {
          axios
            .post(`/company/join`, {
              companyId: companyId,
              companyName: companyName,
              role: role,
              userId: res.data.user._id,
              name: res.data.user.name,
              email: res.data.user.email,
            })
            .then((res) => {
              successToaster("You have successfully signed up");
              setSignUpModal(false);
              clearForm();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setSignUpModal(false);
          successToaster("You have successfully signed up");
          clearForm();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          position: "top-left",
        });
      });
  };
  const CustomTextField = TextField;

  return (
    <div className="login__container">
      <form onSubmit={handleSubmit}>
        <h1>Create your Account</h1>

        <Stack width={"100%"}>
          <CustomTextField
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Enter Name"
            variant="outlined"
            className="input"
            error={nameError}
          />

          <CustomTextField
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Enter Email"
            variant="outlined"
            className="input"
            error={emailError}
          />
          <CustomTextField
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            min={6}
            label="Enter Pasword"
            variant="outlined"
            className="input"
            error={passwordError}
          />
          <CustomTextField
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            min={6}
            label="Confirm Pasword"
            variant="outlined"
            className="input"
            error={confirmPasswordError}
          />
        </Stack>
        {/* <p>
          I Agree to Workonit{" "}
          <Link
            style={{ textDecoration: "underline", color: "blue" }}
            to={"/terms"}
          >
            Terms
          </Link>
          , and I have read the{" "}
          <Link
            style={{ textDecoration: "underline", color: "blue" }}
            to={"/privacy"}
          >
            Privacy Policy
          </Link>
          .
        </p> */}

        <p>
          I Agree to Workonit{" "}
          <a
            href={`${environmentUrls.file_url}/WorkOnIt-Terms_of_Service.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Terms
          </a>
          , and I have read the{" "}
          <a
            href={`${environmentUrls.file_url}/WorkOnIt-Privacy_Notice.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Privacy Policy
          </a>
          .
        </p>
        <Button type="submit">Sign Up</Button>

        <div className="signup-text">
          Already have an account?{" "}
          <span
            className="signup__link"
            onClick={() => {
              setSignUpModal(false);
            }}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
