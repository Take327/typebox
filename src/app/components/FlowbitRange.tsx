import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite, RangeSlider } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  rangeSlider: {
    root: {
      base: "flex",
    },
    field: {
      base: "relative w-full",
      input: {
        base: "w-full cursor-pointer appearance-none rounded-lg bg-gray-200",
        sizes: {
          sm: "h-1",
          md: "h-2",
          lg: "h-3",
        },
      },
    },
  },
};

export default function FlowbitRange() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
        {/* スライダー */}
        <RangeSlider
          style={{
            width: "50vw",
          }}
          min={-2}
          max={2}
          step={1}
        />
    </Flowbite>
  );
}
