import { NavLink, useNavigate } from "react-router-dom";
import {
  useAuthUserQuery,
  useLogoutMutation,
  userApiSlice,
} from "../features/auth/slices/userApiSlices";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/slices/authSlices";
import { toast } from "react-hot-toast";

function Header({ handleClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data: data,
    }),
  });

  const [logout] = useLogoutMutation();
  const handleLogout = async (e) => {
    try {
      const res = await logout().unwrap();
      if (res?.error?.data?.error) {
        return toast.error(res?.error?.data?.error);
      }
      dispatch(logoutUser());
      dispatch(userApiSlice.util.resetApiState());
      navigate('/');
      return toast.success(res?.message);
    } catch (err) {
      return toast.error(err?.data?.errMsg || 'something went wrong to logout');
    }
  };
  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
      <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-primary mb-0">
          <i className="fa fa-hashtag"></i>
        </h2>
      </a>
      <a
        href="#"
        className="sidebar-toggler flex-shrink-0"
        onClick={handleClick}
      >
        <i className="fa fa-bars"></i>
      </a>
      <form className="d-none d-md-flex ms-4">
        <input
          className="form-control border-0"
          type="search"
          placeholder="Search"
        />
      </form>
      <div className="navbar-nav align-items-center ms-auto">
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-envelope me-lg-2"></i>
            <span className="d-none d-lg-inline-flex">Message</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src="img/user.jpg"
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            {/* < className="dropdown-divider"> */}
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src="img/user.jpg"
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src="img/user.jpg"
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item text-center">
              See all message
            </a>
          </div>
        </div>
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-bell me-lg-2"></i>
            <span className="d-none d-lg-inline-flex">Notificatin</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <a href="#" className="dropdown-item">
              <h6 className="fw-normal mb-0">Profile updated</h6>
              <small>15 minutes ago</small>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <h6 className="fw-normal mb-0">New user added</h6>
              <small>15 minutes ago</small>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <h6 className="fw-normal mb-0">Password changed</h6>
              <small>15 minutes ago</small>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item text-center">
              See all notifications
            </a>
          </div>
        </div>
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              className="rounded-circle me-lg-2"
              src={
                data?.profile?.image
                  ? data?.profile?.image
                  : "/img/notFound.jpg"
              }
              alt="profileImg"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="d-none d-lg-inline-flex">
              {data?.profile?.firstName} {data?.profile?.lastName}
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <NavLink
              to="/dashboard/my-profile"
              className={({ isActive }) =>
                isActive ? "dropdown-item active" : "dropdown-item"
              }
            >
              My Profile
            </NavLink>
            <a href="#" className="dropdown-item">
              Settings
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="dropdown-item"
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Header;
