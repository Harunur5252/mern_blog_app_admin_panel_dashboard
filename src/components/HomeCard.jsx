import {
  useGetAllBlogQuery,
  useGetAllCategoryQuery,
  useGetAllTagQuery,
} from "../features/auth/slices/blogAdminPanelOthers/blogOtherAdminPanelSlices";
import {
  useAllUserQuery,
  useAuthUserQuery,
} from "../features/auth/slices/userApiSlices";
// import EmailVerify from "./EmailVerify";

function HomeCard() {
  // blog query
  const { allBlog } = useGetAllBlogQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allBlog: data,
    }),
  });
  // all user query
  const { users } = useAllUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data?.data?.totalUsers,
    }),
  });

  // tag query
  const { allCategory } = useGetAllCategoryQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allCategory: data,
    }),
  });

  // tag query
  const { allTag } = useGetAllTagQuery(undefined, {
    selectFromResult: ({ data }) => ({
      allTag: data,
    }),
  });
  // login user
  const { authUser } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      authUser: data,
    }),
  });
  return (
    <>
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          {authUser?.role?.includes("admin") ? (
            <>
              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fa fa-solid fa-users fa-3x text-primary"></i>
                  <div className="ms-3">
                    <p className="mb-2">Total User</p>
                    <h6 className="mb-0">{users?.length}</h6>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fa fa-solid fa-user fa-3x text-primary"></i>
                  <div className="ms-3">
                    <p className="mb-2">Total User Role</p>
                    <h6 className="mb-0">{2}</h6>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fa fa-solid fa-list fa-3x text-primary"></i>
                  <div className="ms-3">
                    <p className="mb-2">Total Category</p>
                    <h6 className="mb-0">{allCategory?.length}</h6>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fa fa-solid fa-tags fa-3x text-primary"></i>
                  <div className="ms-3">
                    <p className="mb-2">Total Tag</p>
                    <h6 className="mb-0">{allTag?.length}</h6>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <i className="fa fa-solid fa-blog fa-3x text-primary"></i>
                  <div className="ms-3">
                    <p className="mb-2">Total Blog</p>
                    <h6 className="mb-0">{allBlog?.length}</h6>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="container-fluid pt-4 px-4 mt-3">
        <div className="row g-4 bg-light align-items-center justify-content-center mx-0">
          Chart
        </div>
      </div>
    </>
  );
}

export default HomeCard;
