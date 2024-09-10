import React from 'react';
import './NavBar.css';
import { AddOutlined, ExploreOutlined, FavoriteBorderOutlined, HomeOutlined } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { NavBarProps } from '../../interfaces/interfaces';

const NavBar: React.FC<NavBarProps> = ({profilePic}) => {
      const navigate = useNavigate();
    const showHome = () => {
        navigate("/home");
      };
    const showCreatePost = () => {
        navigate("/createpost");
      };
    const showInfo = () => {
        navigate("/userposts");
      };
  return (
    <div className="navbar">
      <div className="navbar__brand">
        <img
          src="logo192.png"
          alt="Instagram Logo"
          className="navbar__logo"
        />
        <span className="navbar__title">React Social.</span>
      </div>
      {/* <input type="text" className="navbar__search" placeholder="Search" /> */}
      <div className="navbar__icons">
        <HomeOutlined style={{fontSize: "32px", cursor: "pointer"}} onClick={showHome}/>
        <AddOutlined style={{fontSize: "28px", cursor: "pointer"}} onClick={showCreatePost}/>
        <ExploreOutlined style={{fontSize: "28px", cursor: "pointer"}} onClick={showHome}/>
        <FavoriteBorderOutlined style={{fontSize: "28px", cursor: "pointer"}}/>
        <img src={profilePic} alt="Profile" onClick={showInfo}/>
      </div>
    </div>
  );
}

export default NavBar;
