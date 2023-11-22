import {
  useGetBlogyAboutQuery,
  useUpdateBlogyAboutMutation,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";

function UpdateBlogAbout({ title }) {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetBlogyAboutQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data?.find((item) => item?._id === id),
    }),
  });
  const [updateBlogyAbout, { isError, isLoading, isSuccess }] =
    useUpdateBlogyAboutMutation();

  useEffect(() => {
    if (isError || isSuccess) {
      setContent("");
    }
  }, [isError, isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogAboutData = {
      _id: id,
      about: content,
    };
    if (content === "" || editor === null) {
      setDescriptionError("about is required");
      return;
    }
    setDescriptionError("");
    try {
      const res = await updateBlogyAbout(blogAboutData).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      navigate("/dashboard/blog/about");
      return toast.success("success");
    } catch (err) {
      console.log(err);
      return toast.error(
        err?.data?.errMsg || "something went wrong to update blogy about"
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
                  <h6 className="mb-4">Update About Blogy</h6>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="floatingTextarea">About</label>
                  <JoditEditor
                    ref={editor}
                    value={content ? content : data.about}
                    onChange={(newContent) => {
                      setContent(newContent);
                    }}
                  />
                  <p style={{ color: "red" }}>{descriptionError}</p>
                </div>
                <div className="d-grid gap-2 mt-2">
                  <button
                    className={`btn btn-success`}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader /> : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateBlogAbout;
