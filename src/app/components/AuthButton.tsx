"use client";

import React from "react";

interface AuthButtonProps {
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  ringColor: string;
  textColor?: string;
  borderColor?: string;
  icon: React.ReactNode;
  label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  bgColor,
  hoverColor,
  ringColor,
  textColor = "text-white",
  borderColor = "",
  icon,
  label,
}) => (
  <button
    className={`flex w-full items-center justify-center py-2 ${textColor} ${bgColor} ${borderColor} rounded-md ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringColor}`}
    onClick={onClick}
    aria-label={label}
  >
    <div className="flex min-w-44 items-center space-x-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </button>
);

export default AuthButton;
