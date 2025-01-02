import React from "react";
import { MBTITendency } from "../../types";

const MBTITendenciesChart: React.FC<MBTITendency> = (
  tendency: MBTITendency
) => {
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
            width: `${Math.abs(tendency.value) / 2}%`,
            transform:
              tendency.value < 0 ? "translateX(-100%)" : "translateX(0)",
          }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-1">
        {tendency.value < 0
          ? `${Math.abs(tendency.value)}% ${tendency.labelMinus}`
          : `${tendency.value}% ${tendency.labelPlus}`}
      </p>
    </div>
  );
};

export default MBTITendenciesChart;
