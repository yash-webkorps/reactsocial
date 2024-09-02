// import React, { useState } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Switch from "@mui/material/Switch";
// import { UserProfileProps } from "../../interfaces/interfaces";
// import "./UserDetails.css";

// const UserProfile: React.FC<UserProfileProps> = (props) => {
//   const [darkMode, setDarkMode] = useState(false);

//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//     },
//     components: {
//       MuiSwitch: {
//         styleOverrides: {
//           root: {
//             width: 62,
//             height: 34,
//             padding: 7,
//             display: 'flex',
//             alignItems: 'center',  // Ensure the switch is centered
//             justifyContent: 'center',  // Center the switch within the parent
//             boxSizing: 'border-box', // Make sure padding and borders are included in the size
//           },
//           switchBase: {
//             padding: 0,
//             "&.Mui-checked": {
//               transform: "translateX(28px)",
//             },
//           },
//           track: {
//             borderRadius: 10, // Ensure the track is fully rounded
//             opacity: 1,
//             backgroundColor: darkMode ? "#8796A5" : "#aab4be",
//             width: 62,
//             height: 18,
//             boxSizing: "border-box",
//           },
//         },
//       },
//     },
//   });

//   const handleThemeChange = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div className={`user-profile ${darkMode ? "dark-theme" : "light-theme"}`}>
//         <Switch
//           checked={darkMode}
//           onChange={handleThemeChange}
//           icon={<span>🌞</span>}
//           checkedIcon={<span>🌜</span>}
//           className="theme-switch"
//         />
//         <img src={props.profilePic} alt="Cover" className="user-profile__cover" />
//         <div className="user-profile__info">
//           <h2 className="user-profile__name">{props.username}</h2>
//           <p className="user-profile__bio">{props.email}</p>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default UserProfile;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserDetails.css";
import { UserProfileProps } from "../../interfaces/interfaces";

const UserProfile: React.FC<UserProfileProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const showInfo = () => {
    navigate("/userposts");
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const isUserPostsPage = (location.pathname === "/userposts");

  return (
    <div className="user-profile">
      <img src={props.profilePic} alt="Cover" className="user-profile__cover" />
      <div className="user-profile__info">
        <h2 className="user-profile__name">{props.username}</h2>
        <p className="user-profile__bio">{props.email}</p>
      </div>
      {isUserPostsPage ? (
        <button onClick={goBack}>Back</button>
      ) : (
        <button onClick={showInfo}>Account Info</button>
      )}
    </div>
  );
};

export default UserProfile;
