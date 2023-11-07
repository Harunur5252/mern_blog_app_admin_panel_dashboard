import React, { useEffect } from "react";
import parse from "html-react-parser";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import {
  useDeleteBlogMutation,
  useGetAllBlogQuery,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function ShowAllBlog({ title }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  let blogSerialNumber = 1;
  // blog query
  const { allBlog } = useGetAllBlogQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allBlog: data,
    }),
  });
  const [deleteBlog, { isLoading }] = useDeleteBlogMutation();
  const handleDeleteBlog = async (_id) => {
    try {
      const res = await deleteBlog({ _id }).unwrap();
      console.log(res);
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("blog deleted successfully");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.data?.errMsg || "something went wrong to delete blog"
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
              <div className="row">
                <div className="col-6">
                  <h6 className="mb-4">Show All Blog</h6>
                </div>
                <div className="col-6">
                  <div style={{ float: "right" }}>
                    <Link to={`/dashboard/blog/add/blog`}>
                      <button type="button" className="btn btn-md btn-dark">
                        Add Blog
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <table className="table table-stripe mt-4" width={100}>
                <thead>
                  <tr>
                    <th scope="col" width={10}>
                      #
                    </th>
                    <th scope="col" width={10}>
                      Title
                    </th>
                    <th scope="col" width={20}>
                      Description
                    </th>
                    <th scope="col" width={10}>
                      Category
                    </th>
                    <th scope="col" width={10}>
                      Tag
                    </th>
                    <th scope="col" width={10}>
                      PublishedDate
                    </th>
                    <th scope="col" width={10}>
                      Image
                    </th>
                    <th
                      scope="col"
                      className="text-center"
                      colSpan={3}
                      width={15}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allBlog?.map((blog) => {
                    return (
                      <tr key={blog?._id}>
                        <th scope="row">{blogSerialNumber++}</th>
                        <td>{blog?.title?.slice(0, 20)}</td>
                        <td>{parse(blog?.description)}</td>
                        <td>{blog?.category}</td>
                        <td>{blog?.tag}</td>
                        <td>
                          {format(new Date(blog?.publishDate), "dd/MMMM/YYY")}
                        </td>
                        <td>
                          <img
                            className="rounded"
                            src={blog?.blogImg}
                            alt="blog picture"
                            height={50}
                            width={50}
                          />
                        </td>
                        <td>
                          <Link to={`/dashboard/blog/update/blog/${blog?._id}`}>
                            <button
                              type="button"
                              className="btn btn-success btn-md"
                            >
                              Edit Blog
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-md"
                            onClick={() => handleDeleteBlog(blog?._id)}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader /> : "Delete Blog"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-md"
                            type="button"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowAllBlog;
