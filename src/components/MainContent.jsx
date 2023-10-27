function MainContent({ children, sidebarToggle }) {
  return (
    <>
      <div className={`content ${sidebarToggle === true ? "open" : null}`}>
        {children}
      </div>
      ;
    </>
  );
}

export default MainContent;
