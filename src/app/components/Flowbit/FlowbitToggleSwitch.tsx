"use client";

import { Flowbite, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import customTheme from "./customTheme";

const FlowbitToggleSwitch = ({ isChecked }: { isChecked: boolean }) => {
  const [switch1, setSwitch1] = useState(isChecked);

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <ToggleSwitch checked={switch1} onChange={setSwitch1} />
    </Flowbite>
  );
};

export default FlowbitToggleSwitch;
