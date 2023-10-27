function Loader({ border = "spinner-border-sm", fontSize, color }) {
  return (
    <div disabled>
      <span className={`spinner-border ${border}`} aria-hidden="true"></span>
      <span role="status" style={{ fontSize, color }}>
        {" "}
        Loading...
      </span>
    </div>
  );
}
export default Loader;
