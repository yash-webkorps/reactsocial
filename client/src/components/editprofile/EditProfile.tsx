import React, { ChangeEvent, useRef, useState } from "react";
import { AxiosError } from "axios";
import "./EditProfile.css";
import ErrorMessage from "../errormessage/ErrorMessage";
import { ClearOutlined } from "@material-ui/icons";
import NavBar from "../navbar/NavBar";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import { updateProfileApi } from "../../services/posts/apis";

const EditProfile: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // State for preview
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // State for profile visibility
  const [profileVisibility, setProfileVisibility] = useState<string>("public");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files) {
        setFile(event.target.files[0]);
        setPreviewURL(URL.createObjectURL(event.target.files[0]));
        setIsPreviewVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPassword(value)

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
        setError(`Password must include ${missingCriteria.join(", ")}.`);
      } else {
        setError(null);
      }

      if (!value) {
        setError(null)
      }
    }
  }
  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfileVisibility(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !email || !password || !file) {
      setError("Please fill in all fields and select an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", file);
    formData.append("visibility", profileVisibility);
  
    setIsLoading(true);
  
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      await updateProfileApi(formData);
  
      navigate('/userposts');
      setUsername("");
      setEmail("");
      setPassword("");
  
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 400:
              setError("All fields are mandatory.");
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
      setIsLoading(false);
    }
  };

  const clearFileInputField = () => {
    setPreviewURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL); // Clean up the URL when the component unmounts
      }
    };
  }, [previewURL]);

  return (
    <>
      <NavBar profilePic="profile.png" />
      <div className="create-post">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            Update Profile Picture:
            <div className="file-input-container">
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                ref={fileInputRef}
              />
              {previewURL && (
                <>
                  <ClearOutlined
                    style={{ cursor: "pointer" }}
                    onClick={clearFileInputField}
                  />
                  <button
                    type="button"
                    className="toggle-preview"
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                  >
                    {isPreviewVisible ? "👁️" : "👁️‍🗨️"}
                  </button>
                </>
              )}
            </div>
            {previewURL && (
              <div className="image-preview-container">
                {!isPreviewVisible && (
                  <div className="image-preview">
                    <img src={previewURL} alt="Profile Preview" />
                  </div>
                )}
              </div>
            )}
          </label>
          <label>
            Profile Visibility:
            <div className="visibility-options">
              <label>
                <input
                  type="radio"
                  value="public"
                  checked={profileVisibility === "public"}
                  onChange={handleVisibilityChange}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  value="private"
                  checked={profileVisibility === "private"}
                  onChange={handleVisibilityChange}
                />
                Private
              </label>
            </div>
          </label>
          {error && <ErrorMessage message={error} />}
          <button
            type="submit"
            disabled={
              !(username !== "" && email !== "" && password !== "" && file)
            }
          >
            Submit
          </button>
        </form>
        {isLoading && <Loader />}
      </div>
    </>
  );
};

export default EditProfile;
