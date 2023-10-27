import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  useAuthUserQuery,
  useLogoutMutation,
  useUpdateUserMutation,
  userApiSlice,
} from "../features/auth/slices/userApiSlices";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/slices/authSlices";
import EmailVerify from "../components/EmailVerify";

const schema = yup.object({
  // image: yup
  //   .mixed()
  //   .test("required", "Please upload a Profile Photo", (value) => {
  //     const arr = [...value];
  //     if (arr.length === 1) {
  //       return true;
  //     }
  //     return false;
  //   })
  //   .test(
  //     "type",
  //     "We only support jpeg,jpg and png image format",
  //     function (value) {
  //       const arr = [...value];
  //       if (
  //         arr[0]?.type === "image/jpeg" ||
  //         arr[0]?.type === "image/jpg" ||
  //         arr[0]?.type === "image/png"
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     }
  //   )
  //   .test("fileSize", "The file size is too large(up to 2MB)", (value) => {
  //     const arr = [...value];
  //     const convertFileSizeToMb = arr[0]?.size / 1024 / 1024;
  //     const file = convertFileSizeToMb.toFixed(2);
  //     if (+file <= 2) {
  //       return true;
  //     }
  //     return false;
  //   }),
  firstName: yup
    .string()
    // .required("firstName is required!")
    .max(20, "firstName must be less than 20 characters!")
    .lowercase()
    .trim(),
  lastName: yup
    .string()
    // .required("lastName is required!")
    .max(20, "lastName must be less than 20 characters!")
    .lowercase()
    .trim(),
  website: yup.string().url().nullable(),
  // .required("website is required!")
  facebook: yup.string().url().nullable(),
  // .required("facebook is required!")
  youtube: yup.string().url().nullable(),
  // .required("youtube is required!")
  twitter: yup.string().url().nullable(),
  // .required("twitter is required!")
  linkedin: yup.string().url().nullable(),
  // .required("linkedin is required!")
  instagram: yup.string().url().nullable(),
  // .required("instagram is required!")
  bio: yup
    .string()
    // .required("biography is required!")
    .max(5000, "biography must be less than 5000 characters!")
    .lowercase()
    .trim(),
});

function UpdateMyProfile({ title }) {
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      website: user?.profile?.website,
      bio: user?.profile?.bio,
      facebook: user?.profile?.social?.facebook,
      youtube: user?.profile?.social?.youtube,
      twitter: user?.profile?.social?.twitter,
      linkedin: user?.profile?.social?.linkedin,
      instagram: user?.profile?.social?.instagram,
    },
  });
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const [updateUser, { isLoading, isSuccess, isError }] =
    useUpdateUserMutation();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError || isSuccess) {
      reset();
    }
  }, [isError, isSuccess, reset]);
  const { id } = useParams();
  const [verifyAlert, setVerifyAlert] = useState(false);
  const [imgError, setImgError] = useState({
    error: "",
  });
  const onSubmit = async (data) => {
    const img = [...[data?.image[0]]];
    const convertFileSizeToMb = img[0]?.size / 1024 / 1024;
    const file = convertFileSizeToMb.toFixed(2);
    if (
      img[0] !== undefined &&
      img[0]?.type !== "image/jpeg" &&
      img[0]?.type !== "image/png"
    ) {
      setImgError({
        error: "We can support only jpeg,jpg and png format",
      });
      return toast.error("We can support only jpeg,jpg and png format");
    } else if (+file > 2) {
      setImgError({
        error: "The file size is too large(up to 2MB)",
      });
      return toast.error("The file size is too large(up to 2MB)");
    } else {
      setImgError({
        error: "",
      });
      try {
        if (user?.isVerified === false && verifyAlert === false) {
          setVerifyAlert(true);
          return;
        }
        if (user?.isVerified === false || verifyAlert === true) {
          setVerifyAlert(false);
          return;
        }
        const userProfileData = {
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          password: data?.password,
          website: data?.website,
          bio: data?.bio,
          facebook: data?.facebook,
          youtube: data?.youtube,
          instagram: data?.instagram,
          linkedin: data?.linkedin,
          twitter: data?.twitter,
        };
        const formData = new FormData();
        formData.append("image", data?.image[0]);
        formData.append("data", JSON.stringify(userProfileData));
        const res = await updateUser({ formData, id }).unwrap();
        if (res?.error?.data?.error) {
          return toast.error(res?.error?.data?.error);
        }
        let loggedOut = "";
        if (data?.email || data?.password) {
          loggedOut = await logout().unwrap();
          dispatch(logoutUser());
          dispatch(userApiSlice.util.resetApiState());
        }
        return toast.success(
          `${
            data?.email || data?.password
              ? loggedOut?.message +
                " ,now you can login with updated credentials!"
              : "Success!"
          }`
        );
      } catch (err) {
        return toast.error(
          err?.data?.errMsg || "something went wrong to update profile"
        );
      }
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-sm-12 col-xl-6">
            <div className="bg-light rounded h-100 p-4">
              <h6 className="mb-4">Update User Profile</h6>
              {verifyAlert && (
                <div
                  className="alert alert-danger alert-dismissible"
                  role="alert"
                >
                  <EmailVerify />
                </div>
              )}
              {user?.profile?._id && (
                <>
                  <span style={{ color: "green" }}>
                    You have already an account, update profile anytime
                  </span>
                </>
              )}
              {user?.profile?._id && user?.profile?._id === id && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                >
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter FirstName"
                      {...register("firstName")}
                    />
                    <label htmlFor="floatingInput">FirstName</label>
                    <span style={{ color: "red" }}>
                      {errors?.firstName?.message}
                    </span>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter LastName"
                      {...register("lastName")}
                    />
                    <label htmlFor="floatingInput">LastName</label>
                    <span style={{ color: "red" }}>
                      {errors?.lastName?.message}
                    </span>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Email"
                      {...register("email")}
                    />
                    <label htmlFor="floatingInput">Email Address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter password"
                      {...register("password")}
                    />
                    <label htmlFor="floatingInput">password</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Website Link"
                      {...register("website")}
                    />
                    <label htmlFor="floatingInput">Website Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.website?.message}
                    </span>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Leave a biography here"
                      id="floatingTextarea"
                      style={{ height: "150px" }}
                      {...register("bio")}
                    ></textarea>
                    <label htmlFor="floatingTextarea">Biography</label>
                    <span style={{ color: "red" }}>{errors?.bio?.message}</span>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      User Image
                    </label>
                    <input
                      className="form-control"
                      {...register("image")}
                      type="file"
                      id="formFile"
                    />
                    <span style={{ color: "red" }}>{imgError?.error}</span>
                    <br />
                    <img
                      className="mt-2"
                      src={user?.profile?.image}
                      height={100}
                      width={100}
                      alt="profileImg"
                    />
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter youtube Link"
                      {...register("youtube")}
                    />
                    <label htmlFor="floatingInput">Youtube Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.youtube?.message}
                    </span>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Facebook Link"
                      {...register("facebook")}
                    />
                    <label htmlFor="floatingInput">Facebook Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.facebook?.message}
                    </span>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Instagram Link"
                      {...register("instagram")}
                    />
                    <label htmlFor="floatingInput">Instagram Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.instagram?.message}
                    </span>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Twitter Link"
                      {...register("twitter")}
                    />
                    <label htmlFor="floatingInput">Twitter Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.twitter?.message}
                    </span>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Enter Linkedin Link"
                      {...register("linkedin")}
                    />
                    <label htmlFor="floatingInput">Linkedin Link</label>
                    <span style={{ color: "red" }}>
                      {errors?.linkedin?.message}
                    </span>
                  </div>

                  <div className="d-grid gap-2 mt-2">
                    <button
                      className={`btn btn-success ${isLoading && "disabled"}`}
                      type="submit"
                    >
                      {isLoading ? <Loader /> : "Update User Profile"}
                    </button>
                  </div>
                </form>
              )}
              {!user?.profile?._id && (
                <>
                  <span style={{ color: "red" }}>Profile id not found</span>
                  <br />
                  <p style={{ color: "red" }}>You do not create your profile</p>
                  <Link
                    to="/dashboard/add-user-profile"
                    className="btn btn-success btn-sm"
                  >
                    Create Your Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateMyProfile;
