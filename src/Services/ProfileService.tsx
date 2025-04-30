
import axiosInstance from "../Interceptor/AxiosInterceptor";
const getProfile = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/profiles/get/${id}`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        throw error;
    }
};

const updateProfile=async (profile:any)=>{
    return axiosInstance.put(`/profiles/update`,profile)
    .then(res=>res.data)
    .catch(error=>{throw error;

    });  
}
const getAllProfile=async ()=>{
    return axiosInstance.get(`/profiles/getAll`)
    .then(res=>res.data)
    .catch(error=>{throw error;

    });
}
export {getProfile,updateProfile ,getAllProfile}