export interface SignupRequestBody {
    username: string,
    email: string,
    password: string
}
export interface ExtendedSignupRequestBody extends SignupRequestBody {
    profilePic: string;
    isPrivate: boolean;
    visibility: string;
}
export interface LoginRequestBody {
    email: string,
    password: string
}
export interface PostRequestBody {
    title: string,
    description: string,
    content: string,
    visibility: string
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
    cloudinaryPublicId: string;
    isAdmin?: boolean;
    isPrivate?: boolean;
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
