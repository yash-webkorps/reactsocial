export interface SignupFormData {
  username: string;
  email: string;
  password: string;
}
export interface LoginFormData {
  email: string;
  password: string;
}
export interface ErrorMessageProps {
  message: string;
}
export interface SuccessMessageProps {
  message: string;
}

export interface User {
  username: string;
  email: string;
  profilePic: string;
  isAdmin: boolean;
}
export interface Comment {
  comment: string;
  user: {
    username: string;
  };
}
export interface PostCardProps {
  id: string;
  title: string;
  description: string;
  content: string;
  likeCounts: number;
  comments: Comment[];
  userName: string;
  isLikedProp: boolean;
  updateNewPost?: (post: any) => void;
  removePostFromUi?: (id: string) => void;
  userId: string;
  isAdmin: boolean;
  likedBy?: User[];
  isPrivate?: boolean
}

export interface CreatePostProps {
  addNewPost: (post: Post) => void;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  cloudinaryPublicId: string;
  userId: string;
  likeCounts: number;
  updatedAt: string;
  createdAt: string;
  user: User;
  isLiked: boolean;
  comments: Comment[];
  likedBy: User[];
  isPrivate: boolean
}

export interface UserProfileProps {
  username: string;
  email: string;
  profilePic: string;
}

export interface EditPostProps {
  id: string;
  title: string;
  description: string;
  closeEditPopup: () => void;
  updatePost: (updatedPost: any) => void;
}

export interface ProfilePicturePopupProps {
  onClose: () => void;
  onSubmit: (file: File) => void;
}

export interface NavBarProps{
  profilePic: string;
}
export interface UserInfoProps{
  username: string;
  profilePic: string;
}