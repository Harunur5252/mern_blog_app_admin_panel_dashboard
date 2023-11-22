import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import {
  useAddCategoryMutation,
  useGetAllCategoryQuery,
  useAddTagMutation,
  useGetAllTagQuery,
  useDeleteCategoryMutation,
  useDeleteTagMutation,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const schema = yup
  .object({
    categoryName: yup
      .string()
      .required("categoryName is required!")
      .max(60, "categoryName must be less than 60 characters!")
      .trim(),
  })
  .required();

function CategoryAndTag({ title }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  let categorySerialNumber = 1;
  let tagSerialNumber = 1;

  const [tag, setTag] = useState({
    tagName: "",
  });
  const [tagError, setTagError] = useState("");
  const handleTag = (value) => {
    setTag({
      tagName: value,
    });
    setTagError("");
  };

  // category mutation
  const [addCategory, { isLoading, isError, isSuccess }] =
    useAddCategoryMutation();
  // tag mutation
  const [
    addTag,
    { isLoading: tagLoading, isError: tagErrors, isSuccess: tagSuccess },
  ] = useAddTagMutation();
  // category query
  const { data: allCategory, isLoading: categoryLoading } =
    useGetAllCategoryQuery();
  // tag query
  const { data: allTag, isLoading: tagQueryLoading } = useGetAllTagQuery();
  // category delete mutation
  const [deleteCategory, { isLoading: categoryDeleteLoading }] =
    useDeleteCategoryMutation();
  // tag delete mutation
  const [deleteTag, { isLoading: tagDeleteLoading }] = useDeleteTagMutation();
  // category reset
  useEffect(() => {
    if (isError || isSuccess) {
      reset();
    }
  }, [reset, isError, isSuccess]);
  // tag reset
  useEffect(() => {
    if (tagErrors || tagSuccess) {
      setTag({
        tagName: "",
      });
      setTagError("");
    }
  }, [tagErrors, tagSuccess]);

  // category add
  const onSubmit = async (data) => {
    const categoryData = {
      categoryName: data?.categoryName,
      categoryItem: data?.categoryName,
    };
    try {
      const res = await addCategory(categoryData).unwrap();
      return toast.success("category added successfully");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.data?.errMsg || "something went wrong to add category"
      );
    }
  };

  // tag add
  const handleTagSubmit = async (e) => {
    e.preventDefault();
    if (tag.tagName === "") {
      setTagError("tagName is required!");
      return;
    } else if (tag.tagName.length > 20) {
      setTagError("tagName must be less than 20 characters!");
      return;
    } else {
      try {
        const res = await addTag(tag).unwrap();
        return toast.success("tag added successfully");
      } catch (error) {
        console.log(error);
        return toast.error(
          error?.data?.errMsg || "something went wrong to add tag"
        );
      }
    }
  };

  const handleCategoryDelete = async (_id) => {
    try {
      const res = await deleteCategory({ _id }).unwrap();
      return toast.success("category deleted successfully");
    } catch (error) {
      console.log(error);
      return toast.error(error?.data?.errMsg);
    }
  };
  const handleTagDelete = async (_id) => {
    try {
      const res = await deleteTag({ _id }).unwrap();
      return toast.success("tag deleted successfully");
    } catch (error) {
      console.log(error);
      return toast.error(error?.data?.errMsg);
    }
  };
  return (
    <>
      <title>{title}</title>
      <div className="container-fluid pt-4 px-4">
        <div className="row bg-light rounded align-items-center justify-content-center mx-0">
          <div className="col-sm-12">
            <div className="bg-light rounded h-100 p-4">
              <h6 className="mb-4">All Category/Tag</h6>
              <div className="row">
                <div className="col-6">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Add Category
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="add category"
                        {...register("categoryName")}
                      />
                      <span style={{ color: "red" }}>
                        {errors?.categoryName?.message}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader /> : "Submit"}
                    </button>
                  </form>
                </div>
                <div className="col-6">
                  <form onSubmit={handleTagSubmit}>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Add Tag
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={tag?.tagName}
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="add tag"
                        onChange={(e) => handleTag(e.target.value)}
                      />
                      <span style={{ color: "red" }}>
                        {tagError ? tagError : ""}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={tagLoading}
                    >
                      {tagLoading ? <Loader /> : "Submit"}
                    </button>
                  </form>
                </div>

                <div className="row">
                  <div className="col-6">
                    <h6 className="text-center mt-2">All Category</h6>
                    <table className="table mt-4 table-bordered table-hover">
                      <thead>
                        <tr className="text-dark">
                          <th scope="col">#</th>
                          <th scope="col">Category Name</th>
                          <th scope="col" colSpan={2} className="text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      {categoryLoading && (
                        <tbody>
                          <tr className="text-center">
                            <td colSpan={3}>
                              <Loader color="red" />
                            </td>
                          </tr>
                        </tbody>
                      )}
                      <tbody>
                        {allCategory?.length > 0 ? (
                          allCategory?.map((category) => {
                            return (
                              <tr className="text-dark" key={category?._id}>
                                <th scope="row">{categorySerialNumber++}</th>
                                <td>{category?.categoryName}</td>
                                <td>
                                  <Link
                                    to={`/dashboard/blog/category/${category?._id}`}
                                  >
                                    <button className="btn btn-sm btn-success">
                                      Edit Category
                                    </button>
                                  </Link>
                                </td>
                                {category?.blogs?.length > 0 ? (
                                  <td className="text-center">
                                    <span
                                      style={{
                                        color: "blue",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                      }}
                                    >
                                      active
                                    </span>
                                  </td>
                                ) : (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        handleCategoryDelete(category?._id)
                                      }
                                      disabled={categoryDeleteLoading}
                                    >
                                      {categoryDeleteLoading ? (
                                        <Loader />
                                      ) : (
                                        "Delete Category"
                                      )}
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="text-danger text-center">
                            <td colSpan={3}>category not available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="col-6">
                    <h6 className="text-center mt-2">All Tag</h6>
                    <table className="table mt-4 table-bordered table-hover">
                      <thead>
                        <tr className="text-dark">
                          <th scope="col">#</th>
                          <th scope="col">Tag Name</th>
                          <th scope="col" colSpan={2} className="text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      {tagQueryLoading && (
                        <tbody>
                          <tr className="text-center">
                            <td colSpan={3}>
                              <Loader color="red" />
                            </td>
                          </tr>
                        </tbody>
                      )}
                      <tbody>
                        {allTag?.length > 0 ? (
                          allTag?.map((tag) => {
                            return (
                              <tr className="text-dark" key={tag?._id}>
                                <th scope="row">{tagSerialNumber++}</th>
                                <td>{tag?.tagName}</td>
                                <td>
                                  <Link to={`/dashboard/blog/tag/${tag?._id}`}>
                                    <button className="btn btn-sm btn-success">
                                      Edit Tag
                                    </button>
                                  </Link>
                                </td>
                                {tag?.blogs?.length > 0 ? (
                                  <td className="text-center">
                                    <span
                                      style={{
                                        color: "blue",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                      }}
                                    >
                                      active
                                    </span>
                                  </td>
                                ) : (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleTagDelete(tag?._id)}
                                      disabled={tagDeleteLoading}
                                    >
                                      {tagDeleteLoading ? (
                                        <Loader />
                                      ) : (
                                        "Delete Tag"
                                      )}
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="text-danger text-center">
                            <td colSpan={3}>tag not available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryAndTag;
