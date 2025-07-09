
import axiosInstance from "../Interceptor/AxiosInterceptor";
const registeredUser=async (user:any)=>{
    return axiosInstance.post(`/users/register`, user)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const sendOtp=async (email:any)=>{
    return axiosInstance.post(`/users/sendOtp/${email}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const sendMobileOtp=async (mobile:any)=>{
    return axiosInstance.post(`/users/sendOtp/mobile/${mobile}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const sendMobileOtpReg=async (mobile:any)=>{
    return axiosInstance.post(`/users/sendOtpReg/mobile/${mobile}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const sendEmailOtp=async (email:any)=>{
    return axiosInstance.post(`/users/sendOtp/email/${email}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const verifyOtp=async (email:any,otp:any)=>{
    return axiosInstance.get(`/users/verifyOtp/${email}/${otp}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const verifyMobileOtp=async (mobile:any,otp:any)=>{
    return axiosInstance.get(`/users/verifyOtp/mobile/${mobile}/${otp}`)
    .then(res=>res.data)
    .catch(error=>{throw error;
    });
}
const changePass = async (credentials: { email?: string, mobile?: string }, password: string) => {
    const payload = {
      ...credentials,
      password: password
    };
    
    return axiosInstance.post(`/users/changePass`, payload)
      .then(res => res.data)
      .catch(error => { throw error; });
  };
export {registeredUser ,sendOtp,verifyOtp,changePass,verifyMobileOtp,sendMobileOtp,sendEmailOtp,sendMobileOtpReg}


















