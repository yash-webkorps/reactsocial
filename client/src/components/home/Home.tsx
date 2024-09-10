import React, { useEffect, useState } from "react";
import PostCard from "../posts/postcard/PostCard";
import { Post, User } from "../../interfaces/interfaces";
import "./Home.css";
import ErrorMessage from "../errormessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/NavBar";
import { fetchPostsApi } from "../../services/posts/apis";
import Loader from "../loader/Loader";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    profilePic: "",
    isAdmin: false,
  });
  
  const [sortOption, setSortOption] = useState<string>("newest");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true)

  const navigate = useNavigate();
  
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
      const res = await fetchPostsApi(1, limit, sortOption);
      
      setPosts(res.posts);
    } catch (error) {
      console.error('Error sorting posts:', error);
      setError("Error Sorting Posts")
    }  finally {
      setIsLoading(false)
    }
  };

  async function authenticateUserAndFetchPosts() {
    try {
      if (hasMorePosts) {  
        setIsLoading(true)

        const { posts, user } = await fetchPostsApi(page, 3, sortOption);

        if (posts.length < 3) {
          setHasMorePosts(false);
        }

        console.log(posts);
        console.log(user);
        
        setPosts(prevPosts => [...prevPosts, ...posts]);
        setUser(user);
      }
    } catch (error) {
      // navigate('/authenticationfailed');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar profilePic={user.profilePic}/>
      
      <div className="post-container">
        <div className="post-container-top">
          <h1>Posts :</h1>
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
              userId={post.userId}
              isAdmin={user.isAdmin}
              likedBy={post.likedBy}
              isPrivate={post.isPrivate}
            />
          ))}
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Home;
