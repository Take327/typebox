import { CustomFlowbiteTheme, Flowbite, Spinner } from "flowbite-react";
import React from "react";
import { useProcessing } from "../../context/ProcessingContext";

const customTheme: CustomFlowbiteTheme = {
  spinner: {
    base: "inline animate-spin text-gray-200",
    color: {
      failure: "fill-red-600",
      gray: "fill-gray-600",
      info: "fill-cyan-600",
      pink: "fill-pink-600",
      purple: "fill-purple-600",
      success: "fill-green-500",
      warning: "fill-yellow-400",
    },
    light: {
      off: {
        base: "text-gray-600",
        color: {
          failure: "",
          gray: "fill-gray-300",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
      on: {
        base: "",
        color: {
          failure: "",
          gray: "",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
    },
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    },
  },
};

const Backdrop: React.FC = () => {
  const { isProcessing } = useProcessing();

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Flowbite theme={{ theme: customTheme }}>
        <Spinner aria-label="Extra large spinner example" size="xl" />
      </Flowbite>
    </div>
  );
};

export default Backdrop;
