import React from "react";
import Navigacio from "../components/nav/Navigacio";
import { Outlet } from "react-router-dom";

const VendegLayout = () => {
  return (
    <>
      <Navigacio />
      <Outlet />
    </>
  );
};

export default VendegLayout;
