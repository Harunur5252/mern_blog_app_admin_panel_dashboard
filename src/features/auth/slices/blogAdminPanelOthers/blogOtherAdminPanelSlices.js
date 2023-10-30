import { blogOtherApiSlice } from "./blogOtherApiSlices";
const USER_URL = "/api/v_1/blog/admin/panel";

export const blogAdminPanelOtherApiSlice = blogOtherApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add/category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    addTag: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add/tag`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/category/${data?._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    updateTag: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/tag/${data?._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    deleteCategory: builder.mutation({
      query: ({ _id }) => ({
        url: `${USER_URL}/category/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    deleteTag: builder.mutation({
      query: ({ _id }) => ({
        url: `${USER_URL}/tag/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: `${USER_URL}/all/category`,
        method: "GET",
      }),
      providesTags: ["BlogAdminPanelOthers"],
    }),
    getAllTag: builder.query({
      query: () => ({
        url: `${USER_URL}/all/tag`,
        method: "GET",
      }),
      providesTags: ["BlogAdminPanelOthers"],
    }),
    addBlog: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add/blog`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useDeleteCategoryMutation,
  useDeleteTagMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateTagMutation,
  useAddTagMutation,
  useGetAllTagQuery,
} = blogAdminPanelOtherApiSlice;
