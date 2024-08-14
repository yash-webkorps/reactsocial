import React, { ChangeEvent, FormEvent, useState } from 'react';
// import axios from 'axios';
import './ProfilePicturePopup.css'; // Create CSS for the popup

interface ProfilePicturePopupProps {
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const ProfilePicturePopup: React.FC<ProfilePicturePopupProps> = ({ onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setPreviewURL(URL.createObjectURL(event.target.files[0]));
      setIsPreviewVisible(true);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
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
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>Please upload Profile Picture</h2>
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <input type="file" onChange={handleFileChange} />
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
          <button type="submit" disabled={!(selectedFile)}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePicturePopup;
