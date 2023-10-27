import { Link, useRouteError, useLocation } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const location = useLocation();
  const urlPath = location?.pathname.startsWith("/dashboard");
  console.log(error)
  return (
    <div id="error-page" className="text-center" style={{ marginTop: "12rem" }}>
      <h1 style={{ color: "red", fontSize: "5rem" }}>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{error.data}</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      {urlPath ? (
        <Link to={`/dashboard`}>
          <button type="button" className="btn btn-secondary">
            Back Home
          </button>
        </Link>
      ) : (
        <Link to={`/`}>
          <button type="button" className="btn btn-secondary">
            Back
          </button>
        </Link>
      )}
    </div>
  );
}
