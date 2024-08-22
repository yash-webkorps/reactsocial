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

interface User {
    username: string;
}
export interface Comment {
    comment: string; // The comment text
    user: User
}
export interface PostCardProps {
    id: string;
    title: string;
    description: string;
    content: string; // URL or path to the image
    likeCounts?: number;
    comments?: Comment[];
    share?: number;
    userName: string;
    isLikedProp: boolean;
    updateNewPost: (post: any) => void;
    removePostFromUi: (id: string) => void;
    userId: string;
    isAdmin: boolean;
  }