import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import UserPosts from "./components/userposts/UserPosts";
import PostDetails from "./components/PostDetails/PostDetails";
import AuthenticationFailed from "./components/authenticationfailed/AuthenticationFailed";
import CreatePost from "./components/posts/createpost/CreatePost";
import EditProfile from "./components/editprofile/EditProfile";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/userposts" element={<UserPosts />} />
        <Route path="/home/userposts/:id" element={<PostDetails />} />
        <Route path="/authenticationfailed" element={<AuthenticationFailed />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/editprofile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
