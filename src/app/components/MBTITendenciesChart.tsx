import React from "react";
import { MBTITendency } from "../../types";

export default function MBTITendenciesChart({
  tendency,
}: {
  tendency: MBTITendency;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-center">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {tendency.labelMinus + " ｜ " + tendency.labelPlus}
        </p>
      </div>
      <div className="relative w-full h-4 bg-gray-200 rounded-full">
        <div
          className={`absolute h-4 rounded-full`}
          style={{
            backgroundColor: `${tendency.color}`,
            left: "50%",
            width: `${Math.abs(tendency.value)}%`,
            transform:
              tendency.value < 0 ? "translateX(-100%)" : "translateX(0)",
          }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-1">
        {tendency.value < 0
          ? `${Math.abs(tendency.value)*2}% ${tendency.labelMinus}`
          : `${tendency.value*2}% ${tendency.labelPlus}`}
      </p>
    </div>
  );
}
