import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "./EditPost.css";
import ErrorMessage from "../../errormessage/ErrorMessage";
import { CloseOutlined } from "@material-ui/icons";

interface EditPostProps {
  id: string;
  title: string;
  description: string;
  closeEditPopup: () => void;
  updatePost: (updatedPost: any) => void;
}

const EditPost: React.FC<EditPostProps> = ({ id, title, description, closeEditPopup, updatePost }) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newFile, setNewFile] = useState<File | null>();
  const [error, setError] = useState<string | null>(null);

  // preview stats
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        setNewFile(event.target.files[0])
        setPreviewURL(URL.createObjectURL(event.target.files[0]));
        setIsPreviewVisible(true);
      }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      if (!title || !description || !newFile) {
        alert("Please fill in all fields and select an image.");
        return;
      } 
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDescription);
      formData.append('content', newFile);

      const res = await axios.put(`/updatePost/${id}`, formData, { headers: { "auth": token } });
      const updatedPost = res.data.updatedPost;
      updatedPost.user = {};
      updatedPost.user.username = res.data.userName;
      updatePost(updatedPost);
      closeEditPopup();
    } catch (err) {
      setError("Failed to update post. Please try again.");
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
      <div className="popup-top">
        <h2>Edit Post</h2>
        <span className="close-btn" onClick={closeEditPopup}><CloseOutlined /></span>
      </div>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleFormSubmit}>
      <label>
          Title:
          <input type="text" onChange={(e) => setNewTitle(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea onChange={(e) => setNewDescription(e.target.value)} required />
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
        <button type="submit" disabled={!(title !== "" && description!== "" && newFile)}>Submit</button>
      </form>
    </div>
  );
};

export default EditPost;
