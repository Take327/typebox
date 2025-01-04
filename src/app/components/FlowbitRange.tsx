/**
 * FlowbitRange コンポーネントは、Flowbite ライブラリの RangeSlider をラップし、
 * ユーザーの入力値を親コンポーネントに渡すためのカスタマイズを行います。
 */

import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite, RangeSlider } from "flowbite-react";
import React from "react";

/**
 * Flowbite のカスタムテーマ定義。
 * RangeSlider の見た目を調整するために使用されます。
 */
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

type FlowbitRangeProps = {
  value: number; // 受け取る値
  onChange?: (score: number) => void;
};

export default function FlowbitRange({ value, onChange }: FlowbitRangeProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(event.target.value);
    onChange?.(val);
  };

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <RangeSlider
        style={{ width: "50vw" }}
        min={0}
        max={4}
        step={1}
        value={value} // ← 親から受け取った value
        onChange={handleChange}
      />
    </Flowbite>
  );
}
