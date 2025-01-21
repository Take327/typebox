"use client";

import { ToggleSwitch } from "flowbite-react";
import { useState } from "react";

const FlowbitToggleSwitch = ({ isChecked }: { isChecked: boolean }) => {
  const [switch1, setSwitch1] = useState(isChecked);

  return <ToggleSwitch checked={switch1} onChange={setSwitch1} />;
};

export default FlowbitToggleSwitch;
