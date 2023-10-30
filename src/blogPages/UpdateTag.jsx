import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllTagQuery,
  useUpdateTagMutation,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Loader from "../components/Loader";

const schema = yup
  .object({
    tagName: yup
      .string()
      .required("tagName is required!")
      .max(20, "tagName must be less than 20 characters!")
      .trim(),
  })
  .required();

function UpdateTag({ title }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateTag, { isLoading, isError, isSuccess }] = useUpdateTagMutation();
  const { tag } = useGetAllTagQuery(undefined, {
    selectFromResult: ({ data }) => ({
      tag: data?.find((item) => item?._id === id),
    }),
  });
  useEffect(() => {
    if (isError || isSuccess) {
      reset();
    }
  }, [reset, isError, isSuccess]);

  const onSubmit = async (data) => {
    const tagData = {
      ...data,
      _id: tag?._id,
    };
    try {
      const res = await updateTag(tagData).unwrap();
      navigate("/dashboard/blog/categories-tags");
      return toast.success("tag updated successfully");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.data?.errMsg || "something went wrong to update tag"
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
                  <h6 className="mb-4">Update Tag</h6>
                </div>
                <div className="col-6">
                  <div style={{ float: "right" }}>
                    <Link to={`/dashboard/blog/categories-tags`}>
                      <button
                        type="button"
                        className="btn btn-md btn-dark"
                      >
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              {tag ? (
                <>
                  <div className="col-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Update Tag
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="update tag"
                          defaultValue={tag?.tagName}
                          {...register("tagName")}
                        />
                        <span style={{ color: "red" }}>
                          {errors?.tagName?.message}
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Update Tag"}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <span className="text-danger">Tag not found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateTag;
