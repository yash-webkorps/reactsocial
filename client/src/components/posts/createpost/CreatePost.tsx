import React, { ChangeEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import "./CreatePost.css";
import ErrorMessage from "../../errormessage/ErrorMessage";

interface CreatePostProps {
  addNewPost: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({addNewPost}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // preview stats
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setPreviewURL(URL.createObjectURL(event.target.files[0]));
      setIsPreviewVisible(true);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !file) {
      alert("Please fill in all fields and select an image.");
      return;
    } 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', file);
    
    try {
      const token = localStorage.getItem("token")

      const res = await axios.post('/addPost', formData, {headers: {'auth': token, 'Content-Type': 'multipart/form-data'}});
      
      const post = res.data.post;
      post.user = {};
      post.user.username = res.data.userName;
      
      addNewPost(post);

      setTitle("")
      setDescription("")
      setFile(null)
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
            <input type="file" onChange={handleFileChange} className="file-input"/>
            {previewURL && (
            <button type="button" className="toggle-preview" onClick={() => setIsPreviewVisible(!isPreviewVisible)} >
              {isPreviewVisible ? '👁️' : '👁️‍🗨️'}
            </button>)
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
        {error && <ErrorMessage message={error} />}
        <button type="submit" disabled={!(title !== "" && description!== "" && file)}>Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
