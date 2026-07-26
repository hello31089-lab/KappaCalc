import Header from "./Header";
import Footer from "./Footer";
import React from "react";

export default function Layout({children} : {children?: React.JSX.Element}) {
  
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
