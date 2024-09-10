import apiClient from './apiClient';
import { LoginFormData } from '../../interfaces/interfaces';

export const signupApi = async (file: File, formData: { username: string; email: string; password: string }) => {
  const formDataWithFile = new FormData();
  formDataWithFile.append('profilePicture', file);
  formDataWithFile.append('username', formData.username);
  formDataWithFile.append('email', formData.email);
  formDataWithFile.append('password', formData.password);

  return await apiClient.post('/signup', formDataWithFile);
};

export const loginUserApi = async (formData: LoginFormData) => {
  return await apiClient.post('/login', formData);
};

export const updateProfileApi = async (formData: FormData) => {
  return await apiClient.put("/editProfile", formData);
};