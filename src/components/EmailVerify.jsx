import { useAuthUserQuery, useVerifyEmailAccountMutation } from "../features/auth/slices/userApiSlices";
import Loader from "./Loader";
import toast from "react-hot-toast";

function EmailVerify() {
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  const id = user?._id;
  const [verifyEmailAccount, { isLoading }] = useVerifyEmailAccountMutation();

  const verifyEmail = async () => {
    try {
      const res = await verifyEmailAccount({ id }).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("email send with account activation link");
    } catch (error) {
      console.log(error);
      return toast.error(error?.data);
    }
  };
  return (
    <>
      <h4>Please verify your email to activate your account</h4>
      <button
        className="btn btn-md btn-success"
        onClick={verifyEmail}
        disabled={isLoading}
      >
        {isLoading ? <Loader /> : "Verify Email"}
      </button>
    </>
  );
}

export default EmailVerify;
