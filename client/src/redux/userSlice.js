// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  name: null,
  email: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { uid, name, email, role } = action.payload;
      state.uid = uid;
      state.name = name;
      state.email = email;
      state.role = role;
    },
    clearUser(state) {
      state.uid = null;
      state.name = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
