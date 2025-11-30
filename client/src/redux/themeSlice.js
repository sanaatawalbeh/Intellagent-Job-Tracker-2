// src/store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storedTheme =
  typeof window !== "undefined" ? localStorage.getItem("theme") : null;

const initialTheme =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";

const initialState = {
  mode: initialTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload; // "light" أو "dark"
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
