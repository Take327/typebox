import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite, Progress } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  progress: {
    base: "w-full overflow-hidden rounded-full bg-gray-200",
    label: "mb-1 flex justify-between font-medium dark:text-white",
    bar: "space-x-2 rounded-full text-center font-medium leading-none text-white",
    color: {
      a8d8cb: "bg-[#a8d8cb]",
    },
    size: {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
      xl: "h-6",
    },
  },
};

export default function FlowbitProgress() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Progress
        progress={90}
        progressLabelPosition="inside"
        textLabelPosition="outside"
        size="lg"
        labelProgress
        color="a8d8cb"
      />
    </Flowbite>
  );
}
