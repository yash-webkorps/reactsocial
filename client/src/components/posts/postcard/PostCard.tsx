import React, { useEffect, useState } from "react";
import "./PostCard.css";
import { Comment, Post, PostCardProps } from "../../../interfaces/interfaces";
import { ChromeReaderModeOutlined, DeleteOutline, EditOutlined, Facebook, FavoriteBorderOutlined, FavoriteOutlined, Link, ModeCommentOutlined, MoreVertOutlined, SendOutlined, WhatsApp } from "@material-ui/icons";
import SuccessMessage from "../../successmessage/SuccessMessage";
import { parseJwt } from "../../../utils/jwtUtils";
import EditPost from "../editpost/EditPost";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { deletePostApi, modifyLikeCountApi, storeCommentApi } from "../../../services/posts/apis";

const PostCard: React.FC<PostCardProps> = ({ id, title, description, content, likeCounts, comments, userName, isLikedProp, updateNewPost, removePostFromUi, userId, isAdmin, likedBy, isPrivate }) => {
  const [likeCount, setLikeCount] = useState<number>(likeCounts)
  const [isLiked, setIsLiked] = useState<boolean>(isLikedProp)
  const [isShowComments, setisShowComments] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [comment, setComment] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [authenticate, setAuthenticate] = useState<boolean>(false);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);

  const navigate = useNavigate();

  const [commentsWillComeHere, setCommentsWillComeHere] = useState<Comment[]>([{
    comment: "",
    user: {
      username: ""
    }
  }])

  const handleLikeClick = async () => {
    try {
      await modifyLikeCountApi(title, isLiked);
  
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCommentsClick = () => {
    setisShowComments(!isShowComments) // toogle    
    setCommentsWillComeHere(comments) // show comments also
  }

  const handleCommentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await storeCommentApi(title, comment);
  
      const token = Cookies.get("token");
      
      if (token) {
        const decodedToken = parseJwt(token);
  
        // Update the state with the new comment
        setCommentsWillComeHere((prevComments) => [
          ...prevComments,
          { comment: comment, user: { username: decodedToken.username } },
        ]);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleShareOptionClick = (option: string) => {
    const url = window.location.href === "http://localhost:3000/home"
      ? `${window.location.href}/userposts/${id}?isPrivate=${isPrivate}`
      : `${window.location.href}?isPrivate=${isPrivate}`;
  
    if (option === "copy") {
      navigator.clipboard.writeText(url);
      setMessage("Link copied to clipboard!");
    } else if (option === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
    } else if (option === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    }
    setShowShareMenu(!showShareMenu);
  };
  

  const handleEnter = () => {
    setShowMenu(true)
  }
  const handleLeave = () => {
    setShowMenu(false)
  }
  const showEditPopupMethod = () => {
    setShowEditPopup(true);
  };

  const showDeletePopupMethod = async () => {
    setShowDeleteConfirmation(true);
  }

  const confirmDelete = async () => {
    try {
      await deletePostApi(id);
      
      setShowDeleteConfirmation(false);
  
      if (removePostFromUi) {
        removePostFromUi(id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false); // Hide the delete confirmation popup
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const updatePost = (updatedPost: Post) => {
    if (updateNewPost) { 
      updateNewPost(updatedPost)
    }
  };

  const showMoreDetails = () => {
    console.log();
    
    navigate(`/home/userposts/${id}`)
  }

  // as per role
  const authenticateUser = () => {
    if (isAdmin) {
      setAuthenticate(true)
    } else {
      const token = Cookies.get("token");
      if (token) {
        const decodedToken = parseJwt(token)

        if (decodedToken.id === userId) {
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

  useEffect(() => {
    authenticateUser();
  })

  const getLikesText = () => {
    if (!likedBy || likedBy.length === 0) return "";

    const [first, ...rest] = likedBy;
    if (rest.length === 0) {
      return (
        <div className="likes-text">
          <img src={first.profilePic} alt={first.username} className="likes-profile-pic" />
          <span>Liked by {first.username}</span>
        </div>
      );
    } else if (rest.length === 1) {
      return (
        <div className="likes-text">
          <img src={first.profilePic} alt={first.username} className="likes-profile-pic" />
          <span>Liked by {first.username} and 1 other.</span>
        </div>
      );
    } else {
      return (
        <div className="likes-text">
          <img src={first.profilePic} alt={first.username} className="likes-profile-pic" />
          <span>Liked by {first.username} and {rest.length} others.</span>
        </div>
      );
    }
  };


  return (
    <div className="post-card" >
      <div className="post-card__image-container">
        <img src={content} alt={title} className="post-card__image" />
        {<MoreVertOutlined className="post-card__more-icon" onMouseEnter={handleEnter} onMouseLeave={handleLeave} />}
        
        {showShareMenu && (
          <div className="post-card__share-menu">
            <div onClick={() => handleShareOptionClick("whatsapp")}>
              <WhatsApp />
              <span>WhatsApp</span>
            </div>
            <div onClick={() => handleShareOptionClick("facebook")}>
              <Facebook />
              <span>Facebook</span>
            </div>
            <div onClick={() => handleShareOptionClick("copy")}>
              <Link />
              <span>Copy Link</span>
            </div>
          </div>
        )}

        {showMenu && (
          <div className="post-card__menu" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {authenticate && (<>
              <div onClick={showEditPopupMethod}>
                <EditOutlined />
                <span>Edit</span>
              </div>
              <div onClick={showDeletePopupMethod}>
                <DeleteOutline />
                <span>Delete</span>
              </div>
            </>)}

            <div onClick={showMoreDetails}>
              <ChromeReaderModeOutlined />
              <span>Show More..</span>
            </div>
          </div>
        )}
        {showEditPopup && (
          <div className="popup-overlay">
            <EditPost
              id={id}
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
          <span className="post-card__likes"> {isLiked ?
            <FavoriteOutlined style={{ cursor: "pointer", color: "red" }} onClick={handleLikeClick} />
            : <FavoriteBorderOutlined style={{ cursor: "pointer" }} onClick={handleLikeClick} />
          } {likeCount}</span>
          <span className="post-card__comments"> <ModeCommentOutlined style={{ cursor: "pointer" }} onClick={handleCommentsClick} /></span>
          <span className="post-card__share"> <SendOutlined style={{ cursor: "pointer" }} onClick={handleShareClick} /></span>
        </div>
        {/* likedBy code goes here */}
        {/* <p className="post-card__likes-text">{getLikesText()}</p> */}
        {getLikesText()}
        {message && <SuccessMessage message={message} />}
        {isShowComments && (
          <div>
            {/* add a comment form */}
            <form onSubmit={handleCommentsSubmit} className="post-card__comment-form">
              <input
                type="text"
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="post-card__comment-input"
              />
              <button type="submit" className="post-card__comment-button">Submit</button>
            </form>

            {/* showing comments */}
            <div className="post-card__comments-list">
              <h3>Comments :</h3>
              {commentsWillComeHere.map((cmt, index) => (
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
