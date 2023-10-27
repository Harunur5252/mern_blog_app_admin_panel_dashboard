import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useAuthUserQuery,
  useLogoutMutation,
  useVerifyAccountMutation,
  userApiSlice,
} from "../features/auth/slices/userApiSlices";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/slices/authSlices";

function AccountActivation({ title }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [logout] = useLogoutMutation();
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  const handleVerifyAccount = async () => {
    try {
      const res = await verifyAccount({ token }).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      } else if (user && user) {
        const logoutMsg = await logout().unwrap();
        dispatch(logoutUser());
        dispatch(userApiSlice.util.resetApiState());
        navigate("/");
        return toast.success(res + " " + "and" + " " + logoutMsg?.message);
      } else {
        navigate("/");
        return toast.success(res);
      }
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.data?.errMsg || "something went wrong to account activation"
      );
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-sm-12 col-md-6 col-lg-6">
            <div
              className="card"
              style={{ width: "22rem", margin: "0 auto", marginTop: "80px" }}
            >
              <div className="card-body">
                <h5 className="card-title text-center text-dark">
                  Active Your Account
                </h5>
                <p className="card-text">
                  Active to account click to below{" "}
                  <strong>
                    {" "}
                    <em style={{ color: "darkblue" }}>Activate Account</em>
                  </strong>{" "}
                  button
                </p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleVerifyAccount}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : "Activate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountActivation;
