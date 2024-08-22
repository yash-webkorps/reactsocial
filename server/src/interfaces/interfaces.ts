export interface SignupRequestBody {
    username: string,
    email: string,
    password: string
}
export interface LoginRequestBody {
    email: string,
    password: string
}
export interface PostRequestBody {
    title: string,
    description: string,
    content: string
}
export interface modifyLikeRequestBody {
    title: string,
    isLiked: boolean
}
export interface CommentBody {
    title: string
    comment: string
}
export interface UserAttributes {
    id: string;
    profilePic: string;
    username: string;
    email: string;
    password: string;
    isAdmin?: boolean
}
export interface LikeAttributes {
    id: string;
    userId?: string;
    postId?: string;
}
export interface CommentAttributes {
    id: string;
    comment: string;
    userId?: string;
    postId?: string;
}
