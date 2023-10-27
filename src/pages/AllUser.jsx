import { useEffect, useState } from "react";
import {
  useAllUserQuery,
  useAuthUserQuery,
} from "../features/auth/slices/userApiSlices";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

function AllUser({ title }) {
  let serialNumber = 1;
  const [userData, setUserData] = useState();
  const [isUser, setIsUser] = useState(true);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [pageActive, setPageActive] = useState(true);
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  const { data, isFetching, error, status } = useAllUserQuery(
    page,
    { skip: isUser },
    page
  );
  useEffect(() => {
    if (data?.filterUser) {
      setUserData([...data.filterUser]);
    }
  }, [data?.filterUser]);
  // search users
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
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-12">
            <div className="bg-light rounded h-100 p-4">
              <h6 className="mb-4">All User Table</h6>
              {error ? (
                <div className="alert alert-danger text-center" role="alert">
                  <span style={{fontSize:"1.2rem",fontWeight:"bold"}}>{error?.data?.errMsg}</span>
                </div>
              ) : null}
              <div className="row">
                <div className="col-6">
                  {user?.role?.includes("admin") && isUser && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setIsUser(false)}
                    >
                      Fetch All User
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
                          <th scope="col">Image</th>
                          <th scope="col">Website</th>
                          <th scope="col">Bio</th>
                          <th scope="col">Youtube Link</th>
                          <th scope="col">Facebook Link</th>
                          <th scope="col">Instagram Link</th>
                          <th scope="col">Linkedin Link</th>
                          <th scope="col">Twitter Link</th>
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
                          <td colSpan={5} className="text-center">
                            {(status === "rejected" ||
                              data?.filterUser === undefined) && (
                              <span style={{ color: "red" }}>no user data</span>
                            )}
                          </td>
                        </tr>
                      </tbody>

                      {users?.length > 0 ? (
                        users?.map((singleUser) => {
                          return (
                            <tbody key={singleUser?._id}>
                              <tr>
                                <th scope="row">{serialNumber++}</th>
                                <td>
                                  {singleUser?.profile?.firstName
                                    ? singleUser?.profile?.firstName
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.lastName
                                    ? singleUser?.profile?.lastName
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.email ? singleUser?.email : "no"}
                                </td>
                                <td>
                                  <img
                                    src={
                                      singleUser?.profile?.image
                                        ? singleUser?.profile?.image
                                        : "/img/notFound.jpg"
                                    }
                                    height={45}
                                    width={45}
                                    alt="profileImg"
                                  />
                                </td>
                                <td>
                                  {singleUser?.profile?.website
                                    ? singleUser?.profile?.website
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.bio
                                    ? singleUser?.profile?.bio?.slice(0, 30)
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.social?.youtube
                                    ? singleUser?.profile?.social?.youtube
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.social?.facebook
                                    ? singleUser?.profile?.social?.facebook
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.social?.instagram
                                    ? singleUser?.profile?.social?.instagram
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.social?.linkedin
                                    ? singleUser?.profile?.social?.linkedin
                                    : "no"}
                                </td>
                                <td>
                                  {singleUser?.profile?.social?.twitter
                                    ? singleUser?.profile?.social?.twitter
                                    : "no"}
                                </td>
                                <td>
                                  <Link
                                    to={`/dashboard/singleUser/${singleUser?._id}`}
                                  >
                                    <button className="btn btn-primary btn-sm">
                                      View
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan={13} className="text-center">
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

export default AllUser;
