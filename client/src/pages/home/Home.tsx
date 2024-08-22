import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import PostCard from "../../components/posts/postcard/PostCard";
import CreatePost from "../../components/posts/createpost/CreatePost";
import UserProfile from "../../components/userdetails/UserDetails";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState({
    username: "",
    email: "",
    profilePic: "",
    isAdmin: false
  });

  const [sortOption, setSortOption] = useState<string>("newest");

  
  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    sortPosts();
  }, [sortOption]);

  const sortPosts = () => {
    const sortedPosts = [...posts];
    
    if (sortOption === "newest") {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === "oldest") {
      sortedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === "mostLiked") {
      sortedPosts.sort((a, b) => b.likeCounts - a.likeCounts);
    } else {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setPosts(sortedPosts);
  };
 
  const addNewPost = (newPost: any) => {    
    setPosts((prevPosts)=> [...prevPosts, newPost])
  }
  const updateNewPost = (updatedPost: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };
  const removePostFromUi = (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== id)
    );
  };
  
  

  async function authenticateUser() {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get('/posts', { headers: { 'auth': token } });

      const posts = res.data.posts;
      const user = res.data.user;

      posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(user);
      
      setPosts(posts);
      setUser(user);

      // sortPosts()
    } catch (error) {
      console.log(error);
      
      alert("Error fetching posts");
    }
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (<>
    <div className="home">
      <UserProfile username={user.username} email={user.email} profilePic={user.profilePic}/>
      <CreatePost addNewPost={addNewPost}/>
    </div>
    <div className="post-container">
      <div className="post-container-top">
        <h1>Posts :</h1>
        <select className="sort-select" value={sortOption} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
      </div>

      <div className="posts-grid">
        {posts.map((post) => ( 
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            content={post.content}
            likeCounts={post.likeCounts}
            comments={post.comments}
            share={post.share}
            userName={post.user.username}
            isLikedProp={post.isLiked}
            updateNewPost = {updateNewPost}
            removePostFromUi = {removePostFromUi}
            userId = {post.userId}
            isAdmin = {user.isAdmin}
          />
        ))}
      </div>
    </div>
  </>
  );
};

export default Home;
