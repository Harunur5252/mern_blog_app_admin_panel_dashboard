import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useAddUserMutation,
  useAuthUserQuery,
} from "../features/auth/slices/userApiSlices";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import EmailVerify from "../components/EmailVerify";

const schema = yup
  .object({
    image: yup
      .mixed()
      .test("required", "Please upload a Profile Photo", (value) => {
        const arr = [...value];
        if (arr.length === 1) {
          return true;
        }
        return false;
      })
      .test(
        "type",
        "We only support jpeg,jpg and png image format",
        function (value) {
          const arr = [...value];
          if (
            arr[0]?.type === "image/jpeg" ||
            arr[0]?.type === "image/jpg" ||
            arr[0]?.type === "image/png"
          ) {
            return true;
          }
          return false;
        }
      )
      .test("fileSize", "The file size is too large(up to 2MB)", (value) => {
        const arr = [...value];
        const convertFileSizeToMb = arr[0]?.size / 1024 / 1024;
        const file = convertFileSizeToMb.toFixed(2);
        if (+file <= 2) {
          return true;
        }
        return false;
      }),
    firstName: yup
      .string()
      .required("firstName is required!")
      .max(20, "firstName must be less than 20 characters!")
      .lowercase()
      .trim(),
    lastName: yup
      .string()
      .required("lastName is required!")
      .max(20, "lastName must be less than 20 characters!")
      .lowercase()
      .trim(),
    website: yup.string().url().nullable().required("website is required!"),
    facebook: yup.string().url().nullable().required("facebook is required!"),
    youtube: yup.string().url().nullable().required("youtube is required!"),
    twitter: yup.string().url().nullable().required("twitter is required!"),
    linkedin: yup.string().url().nullable().required("linkedin is required!"),
    instagram: yup.string().url().nullable().required("instagram is required!"),
    bio: yup
      .string()
      .required("biography is required!")
      .max(5000, "biography must be less than 5000 characters!")
      .lowercase()
      .trim(),
  })
  .required();

function AddUserProfile({ title }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [verifyAlert, setVerifyAlert] = useState(false);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const [addUser, { isLoading, isSuccess, isError }] = useAddUserMutation();
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  useEffect(() => {
    if (isError || isSuccess) {
      reset();
    }
  }, [isError, isSuccess, reset]);
  const onSubmit = async (data) => {
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
      const res = await addUser(formData);
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      navigate("/dashboard/my-profile");
      return toast.success("Success!");
    } catch (err) {
      return toast.error(err?.data?.errMsg || "something went wrong to create profile");
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-sm-12 col-xl-6">
            <div className="bg-light rounded h-100 p-4">
              <h6 className="mb-4">Add User Profile</h6>
              {verifyAlert && (
                <div
                  className="alert alert-danger alert-dismissible"
                  role="alert"
                >
                  <EmailVerify />
                </div>
              )}
              {user?.profile?._id ? (
                <>
                  <p style={{ color: "red" }}>
                    Already profile created,you can update anytime
                  </p>
                  <Link to={"/dashboard/my-profile"}>
                    <button type="button" className="btn btn-sm btn-success">
                      Go To Your Profile Page
                    </button>
                  </Link>
                </>
              ) : (
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
                    <span style={{ color: "red" }}>
                      {errors?.image?.message}
                    </span>
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
                      {isLoading ? <Loader /> : "Add User Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUserProfile;
