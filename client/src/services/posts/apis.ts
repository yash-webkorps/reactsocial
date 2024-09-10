import apiClient from './apiClient';

export const fetchPostsApi = async (page: number, limit: number, sortOption: string) => {
  const res = await apiClient.get("/", {
    params: { page, limit, sortOption },
  });

  return res.data;
};

export const addPostApi = async (formData: FormData) => {
  return await apiClient.post('/', formData);
};

export const fetchUserPostsApi = async (page: number, limit: number, sortOption: string) => {
  const res = await apiClient.get("/usersPosts", {
    params: {page, limit, sortOption}
  });

  return res.data;
};

export const modifyLikeCountApi = async (title: string, isLiked: boolean) => {
  const postDetails = {
    title: title,
    isLiked: isLiked,
  };

  return await apiClient.put('/modifyLikeCount', postDetails);
};

export const storeCommentApi = async (title: string, comment: string) => {
  const commentBody = {
    title: title,
    comment: comment,
  };

  return await apiClient.post('/addComment', commentBody);
};

export const deletePostApi = async (id: string) => {
  return await apiClient.delete(`/${id}`);
};

export const updatePostRequestApi = async (id: string, formData: FormData) => {
  return await apiClient.put(`/${id}`, formData);
};

export const postDetailsApi = async (id: string, isPrivate: boolean) => {
  return await apiClient.get(`/postdetails/${id}?isPrivate=${isPrivate}`);
};