import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/slices/authSlices";
import { useUserRegisterMutation } from "../features/auth/slices/userApiSlices";
import { useEffect } from "react";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const schema = yup
  .object({
    email: yup.string().email().required("email is required!"),
    password: yup
      .string()
      .required("password is required!")
      .min(8, "password must be at least 8 characters!")
      .max(15, "password must be less than 15 characters!"),
  })
  .required();

function Register({ title }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userRegister, { isLoading, isError, isSuccess }] =
    useUserRegisterMutation();
  useEffect(() => {
    if (isSuccess || isError) {
      reset();
    }
  }, [isError, reset, isSuccess]);
  const onSubmit = async (data) => {
    try {
      const res = await userRegister(data).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      dispatch(setCredentials(res));
      navigate("/dashboard");
      return toast.success("success!");
    } catch (err) {
      return toast.error(
        err?.data?.errMsg || "something went wrong to register"
      );
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-xxl position-relative bg-white d-flex p-0">
        <div className="container-fluid">
          <div
            className="row h-100 align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
              <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <a className="text-center">
                    <h3 className="text-primary">
                      <i className="fa fa-hashtag me-2"></i>Register Page
                    </h3>
                  </a>
                  {/* <h3>Sign Up</h3> */}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingEmail"
                      placeholder="Enter Email Address"
                      {...register("email")}
                    />
                    <span style={{ color: "red" }}>
                      {errors?.email?.message}
                    </span>
                    <label htmlFor="floatingEmail">Email address</label>
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Enter Password"
                      {...register("password")}
                    />
                    <span style={{ color: "red" }}>
                      {errors?.password?.message}
                    </span>
                    <label htmlFor="floatingPassword">Password</label>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="exampleCheck1"
                      >
                        Check me out
                      </label>
                    </div>
                    <a href="">Forgot Password</a>
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-success py-3 w-100 mb-4 ${
                      isLoading && "disabled"
                    }`}
                  >
                    {isLoading ? <Loader /> : "Sign Up"}
                  </button>
                </form>
                <p className="text-center mb-0">
                  Already have an Account? <Link to={"/"}>Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
