import React, { useEffect, useState } from "react";
import PostCard from "../posts/postcard/PostCard";
import { Post, User } from "../../interfaces/interfaces";
import "./PostDetails.css";
import ErrorMessage from "../errormessage/ErrorMessage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import { postDetailsApi } from "../../services/posts/apis";

const PostDetails: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    profilePic: "",
    isAdmin: false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const location = useLocation();
  const {id} = useParams()
  
  useEffect(() => {
    authenticateUserAndFetchPosts();
  }, []);

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
      const params = new URLSearchParams(location.search);
      const isPrivate = params.get('isPrivate') === 'true';
  
      // Fetch the post details with the id and isPrivate parameter
      const res = await postDetailsApi(id as string, isPrivate);

      const posts = [res.data.post];
      
      const user = res.data.user;
      
      setPosts(posts);
      setUser(user);

    } catch (error) {
      navigate('/authenticationfailed')
    }
  }

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <>
      <div className="post-container">
        <div className="post-container-top">
          <h1>Post Details :</h1>
          <button onClick={goBack}><ArrowBackIosOutlined /> Go Back</button>
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
              isPrivate={post.isPrivate}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PostDetails;
