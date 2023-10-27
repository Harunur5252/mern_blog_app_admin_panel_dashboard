import { useEffect, useRef } from "react";
import { animateScroll as scroll } from "react-scroll";

function BackToTop() {
  const elm = useRef();
  function handleScroll() {
    const scrolledValue = window.scrollY;
    if (scrolledValue >= 70) {
      elm.current?.classList?.add("btn-lg-square");
    } else {
      elm.current?.classList?.remove("btn-lg-square");
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <a
      ref={elm}
      className="btn btn-lg btn-primary back-to-top"
      onClick={() => scroll.scrollToTop({
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart'
    })}
    >
      <i className="bi bi-arrow-up"></i>
    </a>
  );
}

export default BackToTop;
