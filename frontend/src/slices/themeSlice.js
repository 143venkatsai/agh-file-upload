import { createSlice } from "@reduxjs/toolkit";

// "DARK" , "LIGHT"

function getThemeFormLocalStorage() {
  let theme = localStorage.getItem("THEME");
  if (theme === "DARK" || theme === "LIGHT") {
    return theme;
  } else {
    return "LIGHT";
  }
}

const initialState = {
  name: getThemeFormLocalStorage(),
};
const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme(state, value) {
      state.name = value.payload;
      localStorage.setItem("THEME", value.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
export const selectTheme = (state) => state.theme.name;
