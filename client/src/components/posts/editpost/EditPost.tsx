import React, { useState, ChangeEvent, FormEvent } from "react";
import "./EditPost.css";
import ErrorMessage from "../../errormessage/ErrorMessage";
import { CloseOutlined } from "@material-ui/icons";
import { EditPostProps } from "../../../interfaces/interfaces";
import { updatePostRequestApi } from "../../../services/posts/apis";

const EditPost: React.FC<EditPostProps> = ({ id, title, description, closeEditPopup, updatePost }) => {
  const [newTitle, setNewTitle] = useState<string>(title);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [newFile, setNewFile] = useState<File | null>();
  const [error, setError] = useState<string | null>(null);
  const [profileVisibility, setProfileVisibility] = useState<string>("public");

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

  const handleVisibilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfileVisibility(event.target.value);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      if (!title || !description || !newFile) {
        alert("Please fill in all fields and select an image.");
        return;
      }
  
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('description', newDescription);
      formData.append('content', newFile);
      formData.append('visibility', profileVisibility);
  
      const res = await updatePostRequestApi(id, formData);
  
      const updatedPost = res.data.updatedPost;
      updatedPost.user = { username: res.data.userName };
      
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
        <button type="submit" disabled={!(title !== "" && description!== "" && newFile)}>Submit</button>
      </form>
    </div>
  );
};

export default EditPost;
