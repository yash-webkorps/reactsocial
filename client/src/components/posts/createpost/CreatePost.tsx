import React, { ChangeEvent, useRef, useState } from "react";
import { AxiosError } from "axios";
import "./CreatePost.css";
import ErrorMessage from "../../errormessage/ErrorMessage";
import { ClearOutlined } from "@material-ui/icons";
import NavBar from "../../navbar/NavBar";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { addPostApi } from "../../../services/posts/apis";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileVisibility, setProfileVisibility] = useState<string>("public");
  

  const navigate = useNavigate()


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // to handle create object failed error
    try {
      if (event.target.files) {
        setFile(event.target.files[0])
        setPreviewURL(URL.createObjectURL(event.target.files[0]));
        setIsPreviewVisible(true);
      } 
    } catch (error) {
      console.log(error);
    }
  }

  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfileVisibility(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || !description || !file) {
      setError("Please fill in all fields and select an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', file);
    formData.append('visibility', profileVisibility);
  
    setIsLoading(true);
  
    try {
      const res = await addPostApi(formData);
  
      const post = res.data.post;
      post.user = { username: res.data.userName };
  
      setTitle('');
      setDescription('');
  
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  
      navigate('/userposts');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 400:
              setError('All fields are mandatory.');
              break;
            case 500:
              setError('Something went wrong on the server.');
              break;
            default:
              setError('An unexpected error occurred.');
              break;
          }
        }
      } else {
        console.error(error);
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFileInputField = () => {
    setPreviewURL(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  React.useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL); // Clean up the URL when the component unmounts
      }
    };
  }, [previewURL]);  

  return (
    <>
    <NavBar profilePic="profile.png"/>
    <div className="create-post">
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Image:
          <div className="file-input-container">
            <input type="file" onChange={handleFileChange} className="file-input" ref={fileInputRef}/>
            {previewURL && (<>  
            <ClearOutlined style={{cursor: "pointer"}} onClick={clearFileInputField}/>
            <button type="button" className="toggle-preview" onClick={() => setIsPreviewVisible(!isPreviewVisible)} >
              {isPreviewVisible ? '👁️' : '👁️‍🗨️'}
            </button>
            </>
          )
            }
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
        <button type="submit" disabled={!(title !== "" && description!== "" && file)}>Submit</button>
      </form>
      {isLoading && <Loader />}
    </div>
    </>
  );
};

export default CreatePost;
