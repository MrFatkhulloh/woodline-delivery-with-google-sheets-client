import React from "react";
import SidebarWithHeader from "../sidebar/sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <SidebarWithHeader>{children}</SidebarWithHeader>
    </>
  );
};

export default Layout;