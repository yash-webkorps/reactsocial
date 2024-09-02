import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { SignupFormData } from "../../interfaces/interfaces";
import ErrorMessage from "../errormessage/ErrorMessage";
import './Signup.css';
import ProfilePicturePopup from "../profilepicture/ProfilePicturePopup";
import Loader from "../loader/Loader";
import { signupApi } from "../../services/users/apis";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      const missingCriteria: string[] = [];
      if (!/(?=.*[A-Z])/.test(value)) {
        missingCriteria.push("one uppercase letter");
      }
      if (!/(?=.*\d)/.test(value)) {
        missingCriteria.push("one digit");
      }
      if (!/(?=.*[!@#$%^&*])/.test(value)) {
        missingCriteria.push("one special character");
      }
      if (value.length < 8) {
        missingCriteria.push("at least 8 characters");
      }
      
      if (missingCriteria.length > 0) {
        setPasswordError(`Password must include ${missingCriteria.join(", ")}.`);
      } else {
        setPasswordError(null);
      }
      if (!value) {
        setPasswordError(null)
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPopup(true)
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
  
      await signupApi(file, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
  
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setShowPopup(false);
          const { status } = error.response;
          switch (status) {
            case 400:
              setError("All fields are mandatory.");
              break;
            case 409:
              setError("User already Exist.");
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
    } finally {
      setShowPopup(false); // Hide popup after submission
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>React Social.</h1>
          <p>
            Connect, share, and engage with friends and family on React Social. Discover new people, create posts, and enjoy a world of shared experiences.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {passwordError && <ErrorMessage message={passwordError} />}
            {error && <ErrorMessage message={error} />}
            <button type="submit" disabled={!(formData.username !== "" && formData.email !== "" && formData.password !== "")}>Register</button>
          </form>
        </div>
      </div>
      {showPopup && (
        <ProfilePicturePopup
        onClose={() => setShowPopup(false)}
        onSubmit={handleFileUpload}
        />
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default Signup;

