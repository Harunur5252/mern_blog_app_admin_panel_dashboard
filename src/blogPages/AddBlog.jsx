import { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import {
  useAddBlogMutation,
  useGetAllCategoryQuery,
  useGetAllTagQuery,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

function AddBlog({ title }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [blogDate, setBlogDate] = useState(new Date());
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  // tag query
  const { allCategory } = useGetAllCategoryQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allCategory: data,
    }),
  });

  const [addBlog, { isLoading, isSuccess, isError }] = useAddBlogMutation();

  // tag query
  const { allTag } = useGetAllTagQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allTag: data,
    }),
  });
  useEffect(() => {
    setValue("publishDate", blogDate);
  }, [blogDate, setValue]);

  // reset form after submit
  useEffect(() => {
    if (isSuccess || isError) {
      reset();
      setMediaPreview("");
      setContent("");
    }
  }, [reset, isSuccess, isError, setMediaPreview, setContent]);
  // preview img
  const handleInputFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "blogImg") {
      setMediaPreview(window.URL.createObjectURL(files && files[0]));
    }
  };
  const onSubmit = async (data) => {
    const blogData = {
      title: data?.title,
      description: content,
      category: data?.category,
      tag: data?.tag,
      publishDate: data?.publishDate,
    };
    if (content === "" || editor === null) {
      setDescriptionError("description is required");
      return;
    }
    setDescriptionError("");
    try {
      const formData = new FormData();
      formData.append("image", data?.blogImg[0]);
      formData.append("data", JSON.stringify(blogData));
      const res = await addBlog(formData).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("blog added successfully!");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.errMsg || "something went wrong to create blog"
      );
    } finally {
      setDescriptionError("");
      setMediaPreview("");
      setContent("");
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
                  <h6 className="mb-4">Add Blog</h6>
                </div>
                <div className="col-6">
                  <div style={{ float: "right" }}>
                    <Link to={`/dashboard/blog/categories-tags`}>
                      <button
                        type="button"
                        className="btn btn-md btn-dark"
                      >
                        Add Category/Tag
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="enter title"
                    {...register("title", {
                      required: "title is required",
                      maxLength: {
                        value: 200,
                        message:
                          "title must be equal or less than 200 character",
                      },
                    })}
                  />
                  <span style={{ color: "red" }}>{errors?.title?.message}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    onChange={(newContent) => {
                      setContent(newContent);
                    }}
                  />
                  <span style={{ color: "red" }}>{descriptionError}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Category
                  </label>
                  <select
                    type="select"
                    {...register("category", {
                      required: "category is required",
                    })}
                    className="form-control"
                  >
                    <option value="">select category</option>
                    {allCategory?.map((item) => {
                      return (
                        <option key={item?._id} value={item?.categoryName}>
                          {item?.categoryName}
                        </option>
                      );
                    })}
                  </select>
                  <span style={{ color: "red" }}>
                    {errors?.category?.message}
                  </span>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Tag
                  </label>
                  <select
                    type="select"
                    {...register("tag", {
                      required: "tag is required",
                    })}
                    className="form-control"
                  >
                    <option value="">select tag</option>
                    {allTag?.map((item) => {
                      return (
                        <option key={item?._id} value={item?.tagName}>
                          {item?.tagName}
                        </option>
                      );
                    })}
                  </select>
                  <span style={{ color: "red" }}>{errors?.tag?.message}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    {...register("blogImg", {
                      required: "image is required",
                    })}
                    onChange={handleInputFileChange}
                  />
                  {!mediaPreview && (
                    <span style={{ color: "red" }}>
                      {errors?.blogImg?.message}
                    </span>
                  )}

                  {mediaPreview && (
                    <img
                      className="rounded mt-3"
                      src={mediaPreview && mediaPreview}
                      width={400}
                      height={300}
                      alt="Blog Picture"
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Publish Date&nbsp;&nbsp;
                  </label>
                  <DatePicker
                    className="form-control"
                    {...register("publishDate", {
                      required: "date is required",
                    })}
                    showYearDropdown
                    selected={blogDate}
                    minDate={blogDate}
                    onChange={(date) => setBlogDate(date)}
                  />
                  <span style={{ color: "red" }}>
                    {errors?.publishDate?.message}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBlog;
