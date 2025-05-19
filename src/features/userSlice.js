import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  uid: "",
  email: "",
  username: "",
  photoURL: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LoginUser: (state, action) => {
      const { uid, email, username, photoURL } = action.payload;
      state.uid = uid;
      state.email = email;
      state.username = username;
      state.photoURL = photoURL;
    },
    LogoutUser: (state) => {
      state.uid = "";
      state.email = "";
      state.username = "";
      state.photoURL = "";
    },
  },
});

export const { LoginUser, LogoutUser } = userSlice.actions;
export default userSlice.reducer;
