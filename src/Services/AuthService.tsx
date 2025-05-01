import axios from "axios"
//const base_url="http://localhost:8080/auth/"
const base_url="https://job-portal-backend-smwt.onrender.com/auth/"

const loginUser=async (login:any)=>{
    return axios.post(`${base_url}login`, login)
    .then(result=>result.data)
    .catch(error=>{throw error;

    });
}
const loginUserWithOtpEmail=async (login:any)=>{
  return axios.post(`${base_url}login/with/otp/email`, login)
  .then(result=>result.data)
  .catch(error=>{throw error;

  });
}
const loginUserWithOtpMobile=async (login:any)=>{
  return axios.post(`${base_url}login/with/otp/mobile`, login)
  .then(result=>result.data)
  .catch(error=>{throw error;

  });
}
const navigateToLogin = (navigate: any) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }
export{loginUser,navigateToLogin,loginUserWithOtpEmail,loginUserWithOtpMobile};