import React from "react";
import "./UserDetails.css";

interface UserProfileProps {
  username: string;
  email: string;
  profilePic: string
}

const UserProfile: React.FC<UserProfileProps> = (props) => {
  return (
    <div className="user-profile">
      <img src={props.profilePic} alt="Cover" className="user-profile__cover" />
      <div className="user-profile__info">
        <h2 className="user-profile__name">{props.username}</h2>
        <p className="user-profile__bio">{props.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
