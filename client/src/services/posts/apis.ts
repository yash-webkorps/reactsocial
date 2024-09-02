import axios from "axios";
import Cookies from "js-cookie";
import { Post } from "../../interfaces/interfaces";

export const fetchPostsApi = async (page: number, limit: number) => {
  const token = Cookies.get("token");

  const res = await axios.get("/posts", {
    headers: { auth: token },
    params: { page, limit },
  });

  return res.data;
};

export const sortPostsApi = async (posts: Post[], sortOption: string) => {
  const token = Cookies.get("token");

  const res = await axios.post("/sortPosts", posts, {
    headers: { auth: token },
    params: { sortOption },
  });

  return res.data.sortedPosts;
};

export const fetchUserPostsApi = async () => {
  const token = Cookies.get("token");

  const res = await axios.get("/userposts", {
    headers: { auth: token },
  });

  return res.data;
};

export const modifyLikeCountApi = async (title: string, isLiked: boolean) => {
  const token = Cookies.get("token");

  const postDetails = {
    title: title,
    isLiked: isLiked,
  };

  return await axios.put('/modifyLikeCount', postDetails, {
    headers: { auth: token },
  });
};

export const storeCommentApi = async (title: string, comment: string) => {
  const token = Cookies.get("token");

  const commentBody = {
    title: title,
    comment: comment,
  };

  return await axios.post('/storeComments', commentBody, {
    headers: { auth: token },
  });
};

export const deletePostApi = async (id: string) => {
  const token = Cookies.get("token");

  return await axios.delete(`/deletePost/${id}`, {
    headers: { auth: token },
  });
};

export const updatePostRequestApi = async (id: string, formData: FormData) => {
  const token = Cookies.get("token");

  return await axios.put(`/updatePost/${id}`, formData, {
    headers: { auth: token },
  });
};

export const addPostApi = async (formData: FormData) => {
  const token = Cookies.get("token");

  return await axios.post('/addPost', formData, {
    headers: {
      auth: token,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProfileApi = async (formData: FormData) => {
  const token = Cookies.get("token");

  return await axios.put("/editprofile", formData, {
    headers: { 
      auth: token, 
      "Content-Type": "multipart/form-data" 
    },
  });
};