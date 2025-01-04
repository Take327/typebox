import React from "react";
import { Spinner } from "flowbite-react";
import { useProcessing } from "../../context/ProcessingContext";

const Backdrop: React.FC = () => {
  const { isProcessing } = useProcessing();

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Spinner size="xl" aria-label="処理中..." />
    </div>
  );
};

export default Backdrop;
