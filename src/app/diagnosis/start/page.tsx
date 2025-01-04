"use client";
import React from "react";
import { ProcessingProvider } from "../../../context/ProcessingContext";
import Backdrop from "../../components/Backdrop";
import DiagnosisPage from "./DiagnosisPage";

const Page: React.FC = () => {
  return (
    <ProcessingProvider>
      <Backdrop />
      <DiagnosisPage />
    </ProcessingProvider>
  );
};

export default Page;
