import { createSlice } from "@reduxjs/toolkit";

const state = {
  accessToken: "",
  refreshToken: "",
};

const constantSlice = createSlice({
  name: "constant",
  initialState: state,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
  },
});
export const { setRegisterDetails, setAccessToken, setRefreshToken } =
  constantSlice.actions;
export default constantSlice.reducer;
