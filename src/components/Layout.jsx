import React from "react";
import Footer from "./Footer";
import "./Layout.css"

export default function Layout({ children }) {
  return (
    <>
      
      <main className="main">{children}</main>
      <Footer />
    </>
  );
}
