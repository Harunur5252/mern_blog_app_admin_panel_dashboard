import { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllBlogQuery,
  useUpdateBlogMutation,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import Loader from "../components/Loader";
import { format } from "date-fns";
import toast from "react-hot-toast";

function EditBlog({ title }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { id } = useParams();
  // blog query
  const { blog } = useGetAllBlogQuery(undefined, {
    selectFromResult: ({ data }) => ({
      blog: data?.find((item) => item?._id === id),
    }),
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: blog?.title,
    },
  });
  const editor = useRef(null);
  const editorTwo = useRef(null);
  const navigate = useNavigate();
  const [blogDate, setBlogDate] = useState(
    blog?.publishDate ? new Date(blog?.publishDate) : new Date()
  );
  const [content, setContent] = useState("");
  const [contentTwo, setContentTwo] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");

  // preview img
  const handleInputFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "blogImg") {
      setMediaPreview(window.URL.createObjectURL(files && files[0]));
    }
  };
  useEffect(() => {
    setValue("publishDate", blogDate);
  }, [blogDate, setValue]);
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const onSubmit = async (data) => {
    const blogData = {
      _id: id,
      title: data?.title,
      descriptionOne: content,
      descriptionTwo: contentTwo,
      publishDate: data?.publishDate,
    };
    try {
      const formData = new FormData();
      formData.append("image", data?.blogImg[0]);
      formData.append("data", JSON.stringify(blogData));
      const res = await updateBlog({ formData, _id: id }).unwrap();
      console.log(res);
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      navigate("/dashboard/blog/show/all/blog");
      return toast.success("blog updated successfully!");
    } catch (error) {
      console.log(error);
      return toast.error(
        error?.data?.errMsg || "something went wrong to update blog"
      );
    } finally {
      setMediaPreview("");
      setContent("");
      setContentTwo("");
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
                  <h6 className="mb-4">Update Blog</h6>
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
                    <span style={{ color: "red" }}>
                      {errors?.title?.message}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content ? content : blog?.descriptionOne}
                      onChange={(newContent) => {
                        setContent(newContent);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Description
                    </label>
                    <JoditEditor
                      ref={editorTwo}
                      value={contentTwo ? contentTwo : blog?.descriptionTwo}
                      onChange={(newContent) => {
                        setContentTwo(newContent);
                      }}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
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
                          <option key={item?._id}>{item?.categoryName}</option>
                        );
                      })}
                    </select>
                    <span style={{ color: "red" }}>
                      {errors?.category?.message}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
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
                        return <option key={item?._id}>{item?.tagName}</option>;
                      })}
                    </select>
                    <span style={{ color: "red" }}>{errors?.tag?.message}</span>
                  </div> */}
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
                      Image
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      {...register("blogImg")}
                      onChange={handleInputFileChange}
                    />
                    {mediaPreview && (
                      <img
                        className="rounded mt-3"
                        src={mediaPreview && mediaPreview}
                        width={400}
                        height={300}
                        alt="Blog Picture"
                      />
                    )}
                    {!mediaPreview && blog?.blogImg && (
                      <img
                        className="rounded mt-3"
                        src={blog?.blogImg}
                        width={400}
                        height={300}
                        alt="Blog Picture"
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >
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
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? <Loader /> : "Update Blog"}
                  </button>
                </form>
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

export default EditBlog;
