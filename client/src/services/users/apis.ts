import axios from 'axios';
import { LoginFormData } from '../../interfaces/interfaces';

export const signupApi = async (file: File, formData: { username: string; email: string; password: string }) => {
  const formDataWithFile = new FormData();
  formDataWithFile.append('profilePicture', file);
  formDataWithFile.append('username', formData.username);
  formDataWithFile.append('email', formData.email);
  formDataWithFile.append('password', formData.password);

  return await axios.post('http://localhost:5000/signup', formDataWithFile, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const loginUserApi = async (formData: LoginFormData) => {
  return await axios.post('http://localhost:5000/login', formData);
};