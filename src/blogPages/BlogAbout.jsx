import {
  useAddBlogyAboutMutation,
  useGetBlogyAboutQuery,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";

function BlogAbout({ title }) {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [addBlogyAbout, { isError, isLoading, isSuccess }] =
    useAddBlogyAboutMutation();
  const { data } = useGetBlogyAboutQuery();
  useEffect(() => {
    if (isError || isSuccess) {
      setContent("");
    }
  }, [isError, isSuccess]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content === "" || editor === null) {
      setDescriptionError("about is required");
      return;
    }
    setDescriptionError("");
    try {
      const res = await addBlogyAbout({ about: content }).unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      return toast.success("success");
    } catch (err) {
      console.log(err);
      return toast.error(
        err?.data?.errMsg || "something went wrong to create blogy about"
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
                  <h6 className="mb-4">About Blogy</h6>
                </div>
              </div>
              {data && data[0]?._id ? null : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="floatingTextarea">About</label>
                    <JoditEditor
                      ref={editor}
                      value={content}
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
                      {isLoading ? <Loader /> : "Submit"}
                    </button>
                  </div>
                </form>
              )}

              <table className="table table-responsive table-stripe mt-3">
                <thead>
                  <tr>
                    <th>SI.No</th>
                    <th>About</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>{data && parse(data[0]?.about)}</td>
                    <td>
                      <Link
                        to={`/dashboard/blog/about/${data && data[0]?._id}`}
                      >
                        <button className="btn btn-success" type="button">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogAbout;
