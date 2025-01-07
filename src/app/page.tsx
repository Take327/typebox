"use client";

import React from "react";
import { ProcessingProvider } from "../context/ProcessingContext";
import Backdrop from "./components/Backdrop";
import MyPage from "./MyPage";

const PageWrapper: React.FC = () => {
  return (
    <ProcessingProvider>
      <Backdrop />
      <MyPage />
    </ProcessingProvider>
  );
};

export default PageWrapper;
