import { Link, useParams } from "react-router-dom";
import { useGetAllBlogQuery } from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import parse from "html-react-parser";
import { format } from "date-fns";
import { useAllUserQuery } from "../features/auth/slices/userApiSlices";

function BlogDetails({ title }) {
  const { id } = useParams();
  const { blog } = useGetAllBlogQuery(undefined, {
    selectFromResult: ({ data }) => ({
      blog: data?.find((item) => item?._id === id),
    }),
  });
  const { user } = useAllUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.data?.allUser?.find((user) => user?._id === blog?.user),
    }),
  });
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-sm-12">
            <div className="bg-light rounded h-100 p-4">
              <div className="row">
                <div className="col-6">
                  <h6 className="mb-4">Blog Details</h6>
                </div>
                <div className="col-6">
                  <div style={{ float: "right" }}>
                    <Link to={`/dashboard/blog/show/all/blog`}>
                      <button type="button" className="btn btn-md btn-dark">
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              {blog ? (
                <>
                  <div className="card" style={{ width: "100%" }}>
                    <img
                      src={blog?.blogImg}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title mb-5">{blog?.title}</h5>
                      <p>
                        <strong>
                          {format(new Date(blog?.publishDate), "dd/MMM/YYY")}
                        </strong>
                      </p>
                      <p>
                        category :&nbsp;<strong>{blog?.category}</strong>
                      </p>
                      <p>
                        tag :&nbsp;<strong>{blog?.tag}</strong>
                      </p>
                      <p>
                        complete/incomplete :&nbsp;
                        <strong>
                          {blog?.completed ? (
                            <span
                              style={{
                                color: "blue",
                                fontWeight: "bold",
                                fontSize: "1rem",
                              }}
                            >
                              complete
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "1rem",
                              }}
                            >
                              incomplete
                            </span>
                          )}
                        </strong>
                      </p>
                      <p className="card-text">{parse(blog?.descriptionOne)}</p>
                      <p className="card-text">{parse(blog?.descriptionTwo)}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-success mt-2">Created By:</h5>
                  </div>
                  {user ? (
                    <div className="card mt-2" style={{ width: "24rem" }}>
                      <img
                        src={user?.profile?.image}
                        className="card-img-top"
                        height={200}
                        width={50}
                        alt="..."
                      />
                      <div className="card-body">
                        <p>
                          <strong>{user?.profile?.bio}</strong>
                        </p>
                        <h5 className="card-title mb-5">{user?.email}</h5>

                        <span>
                          <strong>
                            isVerified:&nbsp;
                            {user?.isVerified ? (
                              <span
                                style={{
                                  color: "blue",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                verified
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                not verified
                              </span>
                            )}
                          </strong>
                        </span>
                        <br />
                        <span>
                          role :&nbsp;
                          <strong>
                            {user?.role?.includes("admin") ? (
                              <span
                                style={{
                                  color: "blue",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                Admin
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                User
                              </span>
                            )}
                          </strong>
                        </span>
                        <br />
                        <span>
                          name :&nbsp;
                          <strong>
                            {user?.profile?.firstName} {user?.profile?.lastName}
                          </strong>
                        </span>
                        <br />
                        <span>
                          website :&nbsp;
                          <strong>{user?.profile?.website}</strong>
                        </span>
                        <br />
                        <span>
                          facebook Link :&nbsp;
                          <strong>{user?.profile?.social?.facebook}</strong>
                        </span>
                        <br />
                        <span>
                          youtube Link :&nbsp;
                          <strong>{user?.profile?.social?.youtube}</strong>
                        </span>
                        <br />
                        <span>
                          twitter Link :&nbsp;
                          <strong>{user?.profile?.social?.twitter}</strong>
                        </span>
                        <br />
                        <span>
                          instagram Link :&nbsp;
                          <strong>{user?.profile?.social?.instagram}</strong>
                        </span>
                        <br />
                        <span>
                          linkedin Link :&nbsp;
                          <strong>{user?.profile?.social?.linkedin}</strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-danger">user not found</span>
                  )}
                </>
              ) : (
                <span className="text-danger">blog not found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogDetails;
