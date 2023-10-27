import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/",
  credentials: "include",
});
export const blogOtherApiSlice = createApi({
  baseQuery,
  reducerPath: "blogOtherApiSlice",
  tagTypes: ["BlogAdminPanelOthers"],
  endpoints: (builder) => ({}),
});
