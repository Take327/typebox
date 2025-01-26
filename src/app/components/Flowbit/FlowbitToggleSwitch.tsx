"use client";

import { ToggleSwitch } from "flowbite-react";

const FlowbitToggleSwitch = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: (e: boolean) => Promise<void>;
}) => <ToggleSwitch checked={isChecked} onChange={onChange} />;

export default FlowbitToggleSwitch;
