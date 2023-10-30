import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import {
  useAllUserQuery,
  useAuthUserQuery,
  useUserRoleUpdateMutation,
} from "../features/auth/slices/userApiSlices";
import toast from "react-hot-toast";
import EmailVerify from "../components/EmailVerify";

function UserRoles({ title }) {
  let serialNumber = 1;
  const [userData, setUserData] = useState();
  const [isUser, setIsUser] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [verifyAlert, setVerifyAlert] = useState(false);
  const [userRoleUpdate, { isLoading }] = useUserRoleUpdateMutation();
  const { data, isFetching, error, status } = useAllUserQuery(
    page,
    { skip: isUser },
    page
  );
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  useEffect(() => {
    if (data?.filterUser) {
      setUserData([...data.filterUser]);
    }
  }, [data?.filterUser]);
  const users = userData?.filter((user) => {
    if (
      page <= data?.data?.totalPages &&
      (user?.profile?.firstName?.toLowerCase().includes(text?.toLowerCase()) ||
        user?.profile?.lastName?.toLowerCase().includes(text?.toLowerCase()) ||
        user?.email?.toLowerCase().includes(text?.toLowerCase()))
    ) {
      return user;
    }
  });

  const handleRole = async (e, id) => {
    e.preventDefault();
    const data = {
      _id: id,
      role: userRole && userRole,
    };
    try {
      if (user?.isVerified === false && verifyAlert === false) {
        setVerifyAlert(true);
        return;
      }
      if (user?.isVerified === false || verifyAlert === true) {
        setVerifyAlert(false);
        return;
      }
      const res = await userRoleUpdate(data);
      console.log(res);
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("user role update");
    } catch (err) {
      console.log(err);
      return toast.error(
        err?.data?.errMsg || "something went wrong to update role"
      );
    }
  };

  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-sm-12">
            <div className="bg-light rounded h-100 p-4">
              <h6 className="mb-4">All User Roles</h6>
              {error ? (
                <div className="alert alert-danger text-center" role="alert">
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    {error?.data?.errMsg}
                  </span>
                </div>
              ) : null}
              {verifyAlert && (
                <div
                  className="alert alert-danger alert-dismissible"
                  role="alert"
                >
                  <EmailVerify />
                </div>
              )}
              <div className="row">
                <div className="col-6">
                  {user?.role?.includes("admin") && isUser && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setIsUser(false)}
                    >
                      Fetch All User Role
                    </button>
                  )}
                </div>
                <div className="col-6">
                  {isUser ? null : (
                    <div style={{ float: "right" }}>
                      <input
                        type="search"
                        style={{
                          width: "300px",
                          border: "solid red",
                          color: "black",
                          backgroundColor: "white",
                        }}
                        className="form-control"
                        name="user"
                        placeholder="search user"
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isUser ? null : (
                <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">User Role</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={5} className="text-center">
                            {isFetching && (
                              <Loader
                                border="spinner-border-md"
                                color="red"
                                fontSize="2rem"
                              />
                            )}
                          </td>
                          <td colSpan={6} className="text-center">
                            {(status === "rejected" ||
                              data?.filterUser === undefined) && (
                              <span style={{ color: "red" }}>no user data</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                      {users?.length > 0 ? (
                        users?.map((user) => {
                          return (
                            <tbody key={user?._id}>
                              <tr>
                                <th scope="row">{serialNumber++}</th>
                                <td>{user?.profile?.firstName}</td>
                                <td>{user?.profile?.lastName}</td>
                                <td>{user?.email}</td>
                                <td>
                                  <select
                                    className="form-select"
                                    id="floatingSelect"
                                    aria-label="Floating label select example"
                                    onChange={(e) =>
                                      setUserRole(e.target.value)
                                    }
                                  >
                                    <option disabled>select role</option>
                                    <option
                                      selected={user?.role === "user"}
                                      value="user"
                                    >
                                      User
                                    </option>
                                    <option
                                      selected={user?.role === "admin"}
                                      value="admin"
                                    >
                                      Admin
                                    </option>
                                  </select>
                                </td>
                                <td>
                                  <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) => handleRole(e, user?._id)}
                                    disabled={isLoading}
                                  >
                                    Update Role
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan={6} className="text-center">
                              <span style={{ color: "red" }}>
                                {data?.filterUser?.length === 0 ? (
                                  <span>no data available</span>
                                ) : null}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                  <nav aria-label="Page navigation example" className="mt-3">
                    <ul className="pagination">
                      <li className={`page-item}`}>
                        <button
                          type="button"
                          className="btn btn-primary btn-md"
                          disabled={page === 1}
                          onClick={() => {
                            setPage(page - 1);
                            setIsUser(false);
                          }}
                        >
                          Previous
                        </button>
                      </li>
                      &nbsp;&nbsp;
                      <li className={`page-item`}>
                        <button
                          type="button"
                          className="btn btn-primary btn-md"
                          disabled={page > data?.data?.totalPages}
                          onClick={() => {
                            setPage(page + 1);
                            setIsUser(false);
                          }}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRoles;
