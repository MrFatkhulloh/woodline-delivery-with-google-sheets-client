import { Container } from "@chakra-ui/react";
import React from "react";
import Nav from "../header/header";
import SidebarWithHeader from "../sidebar/sidebar";

const Layout = ({ children }) => {
  return (
    <>  
      <SidebarWithHeader>
        {children}
      </SidebarWithHeader>
      {/* <Nav /> */}
      {/* <Container maxW={"1400px"}>{children}</Container> */}
    </>
  );
};

export default Layout;
