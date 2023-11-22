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
    updateBlog: builder.mutation({
      query: ({ formData, _id }) => ({
        url: `${USER_URL}/blog/${_id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    deleteBlog: builder.mutation({
      query: ({ _id }) => ({
        url: `${USER_URL}/blog/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    publishBlog: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/blog/published/${data?._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    getAllBlog: builder.query({
      query: () => ({
        url: `${USER_URL}/all/blog`,
        method: "GET",
      }),
      providesTags: ["BlogAdminPanelOthers"],
    }),
    addBlogyAbout: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add/blogy/about`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    updateBlogyAbout: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/blogy/about/${data?._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BlogAdminPanelOthers"],
    }),
    getBlogyAbout: builder.query({
      query: () => ({
        url: `${USER_URL}/blogy/about`,
        method: "GET",
      }),
      providesTags: ["BlogAdminPanelOthers"],
    }),
  }),
});

export const {
  useUpdateBlogyAboutMutation,
  useGetBlogyAboutQuery,
  useAddBlogyAboutMutation,
  usePublishBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useGetAllBlogQuery,
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
