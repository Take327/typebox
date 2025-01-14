"use client";

import { CustomFlowbiteTheme, Flowbite, ToggleSwitch } from "flowbite-react";
import { useState } from "react";

/**
 * Flowbite のカスタムテーマ定義。
 * ToggleSwitch の見た目を調整するために使用されます。
 */
const customTheme: CustomFlowbiteTheme = {
  toggleSwitch: {
    root: {
      base: "group flex rounded-lg focus:outline-none",
      active: {
        on: "cursor-pointer",
        off: "cursor-not-allowed opacity-50",
      },
      label: "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900",
    },
    toggle: {
      base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-cyan-500/25",
      checked: {
        on: "after:translate-x-full after:border-white rtl:after:-translate-x-full",
        off: "border-gray-200 bg-gray-200",
        color: {
          blue: "border-cyan-700 bg-cyan-700",
        },
      },
      sizes: {
        sm: "h-5 w-9 min-w-9 after:left-px after:top-px after:h-4 after:w-4 rtl:after:right-px",
        md: "h-6 w-11 min-w-11 after:left-px after:top-px after:h-5 after:w-5 rtl:after:right-px",
        lg: "h-7 w-14 min-w-14 after:left-1 after:top-0.5 after:h-6 after:w-6 rtl:after:right-1",
      },
    },
  },
};

const FlowbitToggleSwitch = ({ isChecked }: { isChecked: boolean }) => {
  const [switch1, setSwitch1] = useState(isChecked);

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <ToggleSwitch checked={switch1} onChange={setSwitch1} />
    </Flowbite>
  );
};

export default FlowbitToggleSwitch;
