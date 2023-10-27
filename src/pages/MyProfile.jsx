import { useEffect, useState } from "react";
import {
  useAuthUserQuery,
  useDeleteUserMutation,
} from "../features/auth/slices/userApiSlices";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import EmailVerify from "../components/EmailVerify";

function MyProfile({ title }) {
  const [verifyAlert, setVerifyAlert] = useState(false);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { data, isFetching } = useAuthUserQuery();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const handleDelete = async (id) => {
    try {
      if (data?.isVerified === false && verifyAlert === false) {
        setVerifyAlert(true);
        return;
      }
      if (data?.isVerified === false || verifyAlert === true) {
        setVerifyAlert(false);
        return;
      }
      const res = await deleteUser(id).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("success");
    } catch (err) {
      return toast.error(
        err?.data?.errMsg || "something went wrong to delete profile"
      );
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-md-6">
            {isFetching && (
              <Loader border="spinner-border-md" fontSize="2rem" color="red" />
            )}
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
                  data?.profile?.image
                    ? data?.profile?.image
                    : "/img/notFound.jpg"
                }
                className="card-img-top rounded"
                height={200}
                width={80}
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">
                  {data?.profile?.firstName}{" "}
                  {data?.profile?.lastName}
                </h5>
                <p className="card-text">{data?.profile?.bio}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <em>
                      <b>Website Link</b>
                    </em>{" "}
                    : {data?.profile?.website}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Facebook Link</b>
                    </em>{" "}
                    : {data?.profile?.social?.facebook}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Youtube Link</b>
                    </em>{" "}
                    : {data?.profile?.social?.youtube}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Instagram</b>
                    </em>{" "}
                    : {data?.profile?.social?.instagram}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Twitter Link</b>
                    </em>{" "}
                    : {data?.profile?.social?.twitter}
                  </li>
                  <li className="list-group-item">
                    <em>
                      <b>Linkedin Link</b>
                    </em>{" "}
                    : {data?.profile?.social?.linkedin}
                  </li>
                </ul>
                {!data?.profile?._id ? (
                  <Link
                    to="/dashboard/add-user-profile"
                    className="btn btn-success btn-sm"
                  >
                    Create Your Profile
                  </Link>
                ) : null}
                {data?.profile?._id ? (
                  <>
                    <Link
                      to={`/dashboard/my-profile/${data?.profile?._id}`}
                      className="btn btn-primary"
                    >
                      Edit Profile
                    </Link>
                    &nbsp;&nbsp;
                    <button
                      type="button"
                      className={`btn btn-danger ${isLoading && "disabled"}`}
                      onClick={() => handleDelete(data?.profile?._id)}
                    >
                      {isLoading ? <Loader /> : " Delete Profile"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
