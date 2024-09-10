import React, { useEffect, useState } from "react";
import PostCard from "../posts/postcard/PostCard";
import { Post, User } from "../../interfaces/interfaces";
import "./UserPosts.css";
import ErrorMessage from "../errormessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import UserInfo from "../userinfo/UserInfo";
import NavBar from "../navbar/NavBar";
import { fetchUserPostsApi } from "../../services/posts/apis";
import Loader from "../loader/Loader";

const UserPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    profilePic: "",
    isAdmin: false,
  });
  
  const [sortOption, setSortOption] = useState<string>("newest");
  const [page, setPage] = useState<number>(1);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()
  
  useEffect(() => {
    authenticateUserAndFetchPosts();
  }, [page]);

  useEffect(() => {
    sortPosts();
  }, [sortOption]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
  
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        setPage((prevPage)=>prevPage+1)
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
}, []);

  const sortPosts = async () => {
    try {
      setIsLoading(true)

      const limit = posts.length;
      const res = await fetchUserPostsApi(1, limit, sortOption);
      
      setPosts(res.posts);
    } catch (error) {
      console.error('Error sorting posts:', error);
      setError("Error Sorting Posts")
    }  finally {
      setIsLoading(false)
    }
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
      setIsLoading(true)

      const { posts, user } = await fetchUserPostsApi(page, 3, sortOption);
  
      setPosts(prevPosts => [...prevPosts, ...posts]);

      setUser(user);
    } catch (error) {
      navigate('/authenticationfailed');
    } finally {
      setIsLoading(false)
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
              likedBy={post.likedBy}
            />
          ))}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default UserPosts;
