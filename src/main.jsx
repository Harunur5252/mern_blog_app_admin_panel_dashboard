import React from "react";
import ReactDOM from "react-dom/client";
import "react-datepicker/dist/react-datepicker.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import ErrorPage from "./components/ErrorPage.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import AllUser from "./pages/AllUser.jsx";
import Register from "./pages/Register.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import AddUserProfile from "./pages/AddUserProfile.jsx";
import store from "./store.js";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import UpdateMyProfile from "./pages/UpdateMyProfile.jsx";
import SingleUser from "./pages/SingleUser.jsx";
import { Toaster } from "react-hot-toast";
import UserRoles from "./pages/UserRoles.jsx";
import AccountActivation from "./pages/AccountActivation.jsx";
import CategoryAndTag from "./blogPages/CategoryAndTag.jsx";
import UpdateCategory from "./blogPages/UpdateCategory.jsx";
import UpdateTag from "./blogPages/UpdateTag.jsx";
import AddBlog from "./blogPages/AddBlog.jsx";
import ShowAllBlog from "./blogPages/ShowAllBlog.jsx";
import EditBlog from "./blogPages/EditBlog.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: "/dashboard",
        element: <Home title="Home" />,
      },
      {
        path: "/dashboard/all-user",
        element: <AllUser title="All User" />,
      },
      {
        path: "/dashboard/add-user-profile",
        element: <AddUserProfile title="add User Profile" />,
      },
      {
        path: "/dashboard/my-profile",
        element: <MyProfile title="My Profile" />,
      },
      {
        path: "/dashboard/my-profile/:id",
        element: <UpdateMyProfile title="Update Profile" />,
      },
      {
        path: "/dashboard/singleUser/:id",
        element: <SingleUser title="Single User Profile" />,
      },
      {
        path: "/dashboard/user-role",
        element: <UserRoles title="User Role" />,
      },
      {
        path: "/dashboard/blog/categories-tags",
        element: <CategoryAndTag title="Category-Tag" />,
      },
      {
        path: "/dashboard/blog/category/:id",
        element: <UpdateCategory title="Update Category" />,
      },
      {
        path: "/dashboard/blog/tag/:id",
        element: <UpdateTag title="Update Tag" />,
      },
      {
        path: "/dashboard/blog/add/blog",
        element: <AddBlog title="Add Blog" />,
      },
      {
        path: "/dashboard/blog/show/all/blog",
        element: <ShowAllBlog title="Show All Blog" />,
      },
      {
        path: "/dashboard/blog/update/blog/:id",
        element: <EditBlog title="Update Blog" />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login title="Login" />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register title="Register" />
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/account-activation/*",
    element: <AccountActivation title="Account-Activation" />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);
