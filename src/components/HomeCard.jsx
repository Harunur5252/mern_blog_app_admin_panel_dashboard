import {
  useAllUserQuery,
  useAuthUserQuery,
} from "../features/auth/slices/userApiSlices";
import EmailVerify from "./EmailVerify";

function HomeCard() {
  const { users } = useAllUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      users: data?.data?.totalUsers,
    }),
  });
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
            <div className="col-sm-6 col-xl-3">
              <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                <i className="fa fa-solid fa-users fa-3x text-primary"></i>
                <div className="ms-3">
                  <p className="mb-2">Total User</p>
                  <h6 className="mb-0">{users?.length}</h6>
                </div>
              </div>
            </div>
          ) : null}

          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-bar fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Total Sale</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-area fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Today Revenue</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-pie fa-3x text-primary"></i>
              <div className="ms-3">
                <p className="mb-2">Total Revenue</p>
                <h6 className="mb-0">$1234</h6>
              </div>
            </div>
          </div>
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
