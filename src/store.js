import { configureStore } from "@reduxjs/toolkit";
import authSlices from "./features/auth/slices/authSlices";
import { apiSlice } from "./features/auth/slices/apiSlices";
import { blogOtherApiSlice } from "./features/auth/slices/blogAdminPanelOthers/blogOtherApiSlices";
const store = configureStore({
  reducer: {
    auth: authSlices,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [blogOtherApiSlice.reducerPath]: blogOtherApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(blogOtherApiSlice.middleware),
  devTools: true,
});
export default store;
