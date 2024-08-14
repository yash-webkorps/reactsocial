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
    title: string;
    description: string;
    content: string; // URL or path to the image
    likeCounts?: number;
    comments?: Comment[];
    share?: number;
    userName: string;
    isLikedProp: boolean;
  }