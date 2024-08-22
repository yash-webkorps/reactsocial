import React, { useEffect, useRef, useState } from "react";
import "./PostCard.css";
import { PostCardProps } from "../../../interfaces/interfaces";
import { DeleteOutline, EditOutlined, FavoriteBorderOutlined, FavoriteOutlined, ModeCommentOutlined, MoreVertOutlined, SendOutlined } from "@material-ui/icons";
import SuccessMessage from "../../successmessage/SuccessMessage";
import axios from "axios";
import { parseJwt } from "../../../utils/jwtUtils";
import EditPost from "../editpost/EditPost";

const PostCard: React.FC<PostCardProps> = ({ id, title, description, content, likeCounts=0, comments=[], userName, isLikedProp, updateNewPost, removePostFromUi, userId, isAdmin}) => {
  const [likeCount, setLikeCount] = useState(likeCounts)
  const [isLiked, setIsLiked] = useState<boolean>(isLikedProp)
  const [isShowComments, setisShowComments] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [authenticate, setAuthenticate] = useState<boolean>(false);


  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

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

  const handleDotClick = () => {
    setShowMenu(!showMenu)
  }
  const handleEditClick = () => {
    setShowEditPopup(true);
  };
  
  const handleDeleteClick = async () => {
    setShowDeleteConfirmation(true);
  }

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    await axios.delete(`/deletePost/${id}`, {headers: {"auth": token}});
    setShowDeleteConfirmation(false);
    removePostFromUi(id)
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the delete confirmation popup
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const updatePost = (updatedPost: any) => {
    updateNewPost(updatedPost)
  };

  const authenticateUser = () => {
    if (isAdmin) {
      setAuthenticate(true)
    } else {
      const token = localStorage.getItem("token")
      if (token) {
        const decodedToken = parseJwt(token)
        
        if (decodedToken.id === userId){
          setAuthenticate(true)
        };
      }
    }
  }
    useEffect(() => {
      if (message) {
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    }, [message]);

    useEffect(()=>{
      authenticateUser();
    })

  return (
    <div className="post-card">
    <div className="post-card__image-container">
      <img src={content} alt={title} className="post-card__image" />
      {authenticate && (<MoreVertOutlined className="post-card__more-icon" onMouseEnter={handleDotClick}/>)}
      {showMenu && (
          <div className="post-card__menu" onMouseLeave={handleDotClick}>
            <div onClick={handleEditClick}>
              <EditOutlined />
              <span>Edit</span>
            </div>
            <div onClick={handleDeleteClick}>
              <DeleteOutline />
              <span>Delete</span>
            </div>
          </div>
        )}
        {showEditPopup && (
        <div className="popup-overlay">
          <EditPost
            id = {id}
            title={title}
            description={description}
            closeEditPopup={closeEditPopup}
            updatePost={updatePost}
          />
        </div>
      )}
    </div>
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
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this post?</p>
          <div className="button-centre">
            <button onClick={confirmDelete} className="confirm-button">Yes</button>
            <button onClick={cancelDelete} className="cancel-button">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
