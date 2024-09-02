import React from 'react';
import './UserInfo.css'; // Make sure to create and style this CSS file
import { useNavigate } from 'react-router-dom';
import { UserInfoProps } from '../../interfaces/interfaces';

const UserInfo: React.FC<UserInfoProps> = ({username, profilePic}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const goEdit = () => {
    navigate('/editprofile');
  };
  return (
    <div className="user-profile-i">
      <div className="profile-header-i">
        <div>
          <img src={profilePic} alt="Profile" className="profile-pic-i" />
        </div>
        <div className="profile-info-i">
          <div className="username-section-i">
            <h2 className="username-i">{username}</h2>
            <button className="edit-profile-button-i" onClick={goEdit}>Edit Profile</button>
            <button className="edit-profile-button-i" onClick={goBack}>Back</button>
          </div>
          <div className="stats-section-i">
            <div className="stat-i">
              <span className="stat-count-i">10</span>
              <span className="stat-label-i">posts</span>
            </div>
            <div className="stat-i">
              <span className="stat-count-i">100</span>
              <span className="stat-label-i">followers</span>
            </div>
            <div className="stat-i">
              <span className="stat-count-i">120</span>
              <span className="stat-label-i">following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
