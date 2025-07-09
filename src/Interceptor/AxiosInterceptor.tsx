import axios, { InternalAxiosRequestConfig } from "axios";
const axiosInstance = axios.create({
   baseURL: 'http://localhost:8080',
    //baseURL: 'https://job-portal-backend-smwt.onrender.com',
  });

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  let redirecting = false;

  export const setupResponseInterceptor = (navigate: any) => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !redirecting) {
          redirecting = true;  // Set the flag to prevent multiple redirects
          navigate('/login');
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  };
export default axiosInstance;   

