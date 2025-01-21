import { CustomFlowbiteTheme, Spinner } from "flowbite-react";
import React from "react";
import { useProcessing } from "../../context/ProcessingContext";

const customTheme: CustomFlowbiteTheme = {};

const Backdrop: React.FC = () => {
  const { isProcessing } = useProcessing();

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  );
};

export default Backdrop;
