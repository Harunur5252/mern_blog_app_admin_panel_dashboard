import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAuthUserQuery,
  useDeleteAllUserMutation,
  useSingleUserQuery,
} from "../features/auth/slices/userApiSlices";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import EmailVerify from "../components/EmailVerify";

function SingleUser({ title }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const [verifyAlert, setVerifyAlert] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSingleUserQuery(id, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  const { data } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data,
    }),
  });
  const [deleteAllUser, { isLoading }] = useDeleteAllUserMutation();

  const handleAllUserDelete = async (_id) => {
    try {
      if (data?.isVerified === false && verifyAlert === false) {
        setVerifyAlert(true);
        return;
      }
      if (data?.isVerified === false || verifyAlert === true) {
        setVerifyAlert(false);
        return;
      }
      const res = await deleteAllUser(_id).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      navigate(-1);
      return toast.success("success");
    } catch (err) {
      return toast.error(
        err?.data?.errMsg || "something went wrong to delete user"
      );
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-md-6">
            <div className="card" style={{ width: "25rem" }}>
              {verifyAlert && (
                <div
                  className="alert alert-danger alert-dismissible"
                  role="alert"
                >
                  <EmailVerify />
                </div>
              )}
              <img
                src={
                  user?.profile?.image
                    ? user?.profile?.image
                    : "/img/notFound.jpg"
                }
                className="card-img-top rounded"
                height={200}
                width={80}
                alt="userImg"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </h5>
                <p className="card-text">{user?.profile?.bio}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <em>
                      <b>Email</b>
                    </em>{" "}
                    : {user?.email}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Website Link</b>
                    </em>{" "}
                    : {user?.profile?.website}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Facebook Link</b>
                    </em>{" "}
                    : {user?.profile?.social?.facebook}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Youtube Link</b>
                    </em>{" "}
                    : {user?.profile?.social?.youtube}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Instagram</b>
                    </em>{" "}
                    : {user?.profile?.social?.instagram}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Twitter Link</b>
                    </em>{" "}
                    : {user?.profile?.social?.twitter}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Linkedin Link</b>
                    </em>{" "}
                    : {user?.profile?.social?.linkedin}
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/dashboard/all-user")}
                  type="button"
                  className="btn btn-md btn-dark"
                >
                  Back
                </button>
                &nbsp;&nbsp;
                {user === undefined ? null : (
                  <button
                    className={`btn btn-danger btn-md ${
                      isLoading && "disabled"
                    }`}
                    onClick={() => handleAllUserDelete(user?._id)}
                  >
                    {isLoading ? <Loader /> : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleUser;
