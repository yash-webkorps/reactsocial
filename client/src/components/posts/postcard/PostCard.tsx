import React, { useEffect, useState } from "react";
import "./PostCard.css";
import { PostCardProps } from "../../../interfaces/interfaces";
import { FavoriteBorderOutlined, FavoriteOutlined, ModeCommentOutlined, SendOutlined } from "@material-ui/icons";
import SuccessMessage from "../../successmessage/SuccessMessage";
import axios from "axios";
import { parseJwt } from "../../../utils/jwtUtils";

const PostCard: React.FC<PostCardProps> = ({ title, description, content, likeCounts=0, comments=[], userName, isLikedProp}) => {
  const [likeCount, setLikeCount] = useState(likeCounts)
  const [isLiked, setIsLiked] = useState<boolean>(isLikedProp)
  const [isShowComments, setisShowComments] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [comment, setComment] = useState("");

  const [showCommentsOnScreen, setshowCommentsOnScreen] = useState([{
    comment: "",
    user: {
      username: ""
    }
  }])

  const handleLikeClick = async (title: string) => {
    try {
    const postDetails = {
      title: title,
      isLiked: isLiked
    }
    const token = localStorage.getItem('token');

    await axios.put('/modifyLikeCount', postDetails, {headers: {"auth": token}})
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    
    setIsLiked(!isLiked)
    } catch (error) {
      console.log(error);
    }

  }
  const handleCommentsClick = () => {
    setisShowComments(!isShowComments)
    setshowCommentsOnScreen(comments)
  }
  
  const handleCommentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token")

    const commentBody = {
      title: title,
      comment: comment
    }
    await axios.post('/storeComments', commentBody, {headers: {"auth": token}})

    if (token) {
      const decodedToken = parseJwt(token)

      // Update the state with the new comment
      setshowCommentsOnScreen((prevComments) => [
        ...prevComments,
        { comment: comment, user: { username: decodedToken.username } },
      ]);
    }
  }
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setMessage("Link copied to clipboard!")
  }

    // Use useEffect to automatically clear the message after 3 seconds
    useEffect(() => {
      if (message) {
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    }, [message]);

  return (
    <div className="post-card">
      <img src={content} alt={title} className="post-card__image" />
      <h3 className="user">{userName}</h3>
      <div className="post-card__content">
        <h2 className="post-card__title">{title}</h2>
        <p className="post-card__description">{description}</p>
        <div className="post-card__stats">
          <span className="post-card__likes"> {isLiked?
           <FavoriteOutlined style={{ cursor: "pointer" , color: "red"}} onClick={()=>{handleLikeClick(title)}}/>
           : <FavoriteBorderOutlined style={{ cursor: "pointer"}} onClick={()=>{handleLikeClick(title)}}/>
        } {likeCount}</span>
          <span className="post-card__comments"> <ModeCommentOutlined style={{ cursor: "pointer" }} onClick={handleCommentsClick}/></span>
          <span className="post-card__share"> <SendOutlined style={{ cursor: "pointer" }} onClick={handleShareClick}/></span>
        </div>
        {message && <SuccessMessage message={message}/>}
        {isShowComments && (
          <div>
            <form onSubmit={handleCommentsSubmit} className="post-card__comment-form">
              <input
                type="text"
                onChange={(e)=>setComment(e.target.value)}
                placeholder="Add a comment..."
                className="post-card__comment-input"
              />
              <button type="submit" className="post-card__comment-button">Submit</button>
            </form>
            <div className="post-card__comments-list">
      <h3>Comments :</h3>
      {showCommentsOnScreen.map((cmt, index) => (
        <div key={index} className="post-card__comment-item">
          <span className="comment-author">{cmt.user.username}:</span>
          <span className="comment-text">{cmt.comment}</span>
        </div>
      ))}
    </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
