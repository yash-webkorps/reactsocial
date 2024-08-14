import React, { useState, ChangeEvent, FormEvent } from "react";

import axios, { AxiosError } from "axios";

import './Login.css'
import { Link, useNavigate } from "react-router-dom";

import { LoginFormData } from "../../interfaces/interfaces";
import ErrorMessage from "../../components/errormessage/ErrorMessage";

const Login : React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
        event.preventDefault();
        console.log("Form submitted:", formData);

        const res = await axios.post('http://localhost:5000/login', formData);

        localStorage.setItem('token', res.data.token)        

        navigate('/home')
        
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 400:
              setError("All fields are mandatory.");
              break;
            case 409:
              setError("Email must be unique.");
              break;
            case 401:
              setError("Invalid credentials.");
              break;
            case 500:
              setError("Something went wrong on the server.");
              break;
            default:
              setError("An unexpected error occurred.");
              break;
          }
        }
      } else {
        console.error(error);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>React Social.</h1>
          <p>
            Connect, share, and engage with friends and family on React Social. Discover new people, create posts, and enjoy a world of shared experiences.
          </p>
          <span>Don't have an account?</span>
          <Link to="/signup">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            {error && <ErrorMessage message={error} />}
            <button type="submit" disabled={!(formData.email !== "" && formData.password !== "")}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
