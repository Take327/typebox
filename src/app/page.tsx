"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ProcessingProvider } from "../context/ProcessingContext";
import Backdrop from "./components/Backdrop";
import MyPage from "./MyPage";

const PageWrapper: React.FC = () => {
  return (
    <SessionProvider>
      <ProcessingProvider>
        <Backdrop />
        <MyPage />
      </ProcessingProvider>
    </SessionProvider>
  );
};

export default PageWrapper;
