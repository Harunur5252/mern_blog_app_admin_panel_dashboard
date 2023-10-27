import { useEffect } from "react";
import HomeCard from "../components/HomeCard";

function Home({ title }) {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return (
    <>
      <title>{title}</title>
      <HomeCard />
    </>
  );
}

export default Home;
