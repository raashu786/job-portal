import { createSlice } from "@reduxjs/toolkit";
import { getItem, removeItem, setItem } from "../Services/LocalStorageService";

const initialState = getItem("user") || null;

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            setItem("user", action.payload);
            return action.payload;
        },
        removeUser: () => {
            removeItem("user");
            removeItem("token");
            return null;
        }
    }
})

export const {setUser,removeUser}=UserSlice.actions;
export default UserSlice.reducer;