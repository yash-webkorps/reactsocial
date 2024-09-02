import React, { useEffect, useState } from "react";
import PostCard from "../posts/postcard/PostCard";
import { Post, User } from "../../interfaces/interfaces";
import "./UserPosts.css";
import ErrorMessage from "../errormessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import UserInfo from "../userinfo/UserInfo";
import NavBar from "../navbar/NavBar";
import Cookies from "js-cookie";
import { fetchUserPostsApi } from "../../services/posts/apis";

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    profilePic: "",
    isAdmin: false,
  });
  
  const [sortOption, setSortOption] = useState<string>("newest");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()
  
  useEffect(() => {
    authenticateUserAndFetchPosts();
  }, []);

  useEffect(() => {
    sortPosts();
  }, [sortOption]);

  const sortPosts = () => {
    const sortedPosts = [...posts];

    if (sortOption === "newest") {
      sortedPosts.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } 
    else if (sortOption === "oldest") {
      sortedPosts.sort((a: Post, b: Post) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } 
    else if (sortOption === "mostLiked") {
      sortedPosts.sort((a: Post, b: Post) => b.likeCounts - a.likeCounts);
    }
    setPosts(sortedPosts);
  };
  const updateNewPost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };
  const removePostFromUi = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };
  async function authenticateUserAndFetchPosts() {
    try {
      const { posts, user } = await fetchUserPostsApi();
  
      posts.sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
      setPosts(posts);
      setUser(user);
    } catch (error) {
      navigate('/authenticationfailed');
    }
  }

  return (
    <>
      <NavBar profilePic="profile.png"/>

      <div className="home">
        <UserInfo username={user.username} profilePic={user.profilePic}/>
      </div>
      
      <div className="post-container">
        <div className="post-container-top">
          <h1>Your Feed :</h1>
          <select className="sort-select" onChange={(e)=>setSortOption(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>

        <div className="posts-grid">
        {error && <ErrorMessage message={error} />}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              content={post.content}
              likeCounts={post.likeCounts}
              comments={post.comments}
              userName={post.user.username}
              isLikedProp={post.isLiked}
              updateNewPost={updateNewPost}
              removePostFromUi={removePostFromUi}
              userId={post.userId}
              isAdmin={user.isAdmin}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPosts;
