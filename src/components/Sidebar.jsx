import { NavLink, useNavigate } from "react-router-dom";
import { useAuthUserQuery } from "../features/auth/slices/userApiSlices";
import { useEffect } from "react";

function Sidebar({ sidebarToggle }) {
  const navigate = useNavigate();
  const { user } = useAuthUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data,
    }),
  });
  useEffect(() => {
    if (user?.role?.includes("user") && !user?.role?.includes("admin")) {
      navigate("/dashboard");
    }
  }, [user]);
  return (
    <div
      className={`sidebar pe-4 pb-3 ${sidebarToggle === true ? "open" : null}`}
    >
      <nav className="navbar bg-light navbar-light">
        <a className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">
            <i className="fa fa-hashtag me-2"></i>Dashboard
          </h3>
        </a>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className={`${user?._id ? "position-relative" : ""}`}>
            <img
              className="rounded-circle"
              src={
                user?.profile?.image
                  ? user?.profile?.image
                  : "/img/notFound.jpg"
              }
              alt="profileImg"
              style={{ width: "40px", height: "40px" }}
            />
            {user?._id && (
              <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
            )}
          </div>
          <div className="ms-3">
            <h6 className="mb-0">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </h6>
            <span>{user?.role?.includes("admin") ? "Admin" : "User"}</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <NavLink to="/dashboard" className="nav-item nav-link active">
            <i className="fa fa-tachometer-alt me-2"></i>
            Dashboard
          </NavLink>

          {/* user pages */}
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="far fa-file-alt me-2"></i>User Pages
            </a>
            <div className="dropdown-menu bg-transparent border-0">
              {user?.role?.includes("admin") && (
                <>
                  <NavLink
                    to="/dashboard/all-user"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    All User
                  </NavLink>
                  <NavLink
                    to="/dashboard/user-role"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    All User Role
                  </NavLink>
                </>
              )}

              {user?.profile?._id ? (
                ""
              ) : (
                <NavLink
                  to="/dashboard/add-user-profile"
                  className={({ isActive }) =>
                    isActive ? "dropdown-item active" : "dropdown-item"
                  }
                >
                  Add User Profile
                </NavLink>
              )}
            </div>
          </div>

          {/* blog pages */}

          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <i className="far fa-file-alt me-2"></i>Blog Pages
            </a>
            <div className="dropdown-menu bg-transparent border-0">
              {user?.role?.includes("admin") && (
                <>
                  <NavLink
                    to="/dashboard/blog/categories-tags"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Blog Category/Tag
                  </NavLink>

                  <NavLink
                    to="/dashboard/blog/add/blog"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Add Blog
                  </NavLink>
                  <NavLink
                    to="/dashboard/blog/show/all/blog"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    Show All Blog
                  </NavLink>
                  <NavLink
                    to="/dashboard/blog/about"
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active" : "dropdown-item"
                    }
                  >
                    About
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
