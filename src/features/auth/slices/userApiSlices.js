import { apiSlice } from "./apiSlices";
const USER_URL = "/api/v_1/blog/admin/panel/auth";
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    userLogin: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/add/profile`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile/${data?.id}`,
        method: "PUT",
        body: data?.formData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (_id) => ({
        url: `${USER_URL}/profile/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    deleteAllUser: builder.mutation({
      query: (_id) => ({
        url: `${USER_URL}/all/profile/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    allUser: builder.query({
      query: (page) => ({
        url: `${USER_URL}/all/profile?page=${page}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    singleUser: builder.query({
      query: (id) => ({
        url: `${USER_URL}/all/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    authUser: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    userRoleUpdate: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/user-role/update/${data?._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmailAccount: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-email`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyAccount: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/verify-account/${data?.token}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSingleUserQuery,
  useDeleteAllUserMutation,
  useVerifyAccountMutation,
  useVerifyEmailAccountMutation,
  useUserRoleUpdateMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAddUserMutation,
  useAuthUserQuery,
  useUserRegisterMutation,
  useUserLoginMutation,
  useLogoutMutation,
  useAllUserQuery,
} = userApiSlice;
