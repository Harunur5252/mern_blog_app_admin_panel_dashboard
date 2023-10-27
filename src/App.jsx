import Header from "./components/Header";
import Layout from "./layouts/Layout";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import ContentRootLayout from "./components/ContentRootLayout";
import BackToTop from "./components/BackToTop";

function App() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const handleClick = (evt) => {
    if (evt.target) {
      setSidebarToggle(!sidebarToggle);
    }
  };

  return (
    <Layout>
      <ContentRootLayout>
        <BackToTop />
        <Sidebar sidebarToggle={sidebarToggle} />
        <MainContent sidebarToggle={sidebarToggle}>
          <Header handleClick={handleClick} />
          <Outlet />
          <Footer />
        </MainContent>
      </ContentRootLayout>
    </Layout>
  );
}

export default App;
