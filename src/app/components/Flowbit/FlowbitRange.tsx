/**
 * FlowbitRange コンポーネントは、Flowbite ライブラリの RangeSlider をラップし、
 * ユーザーの入力値を親コンポーネントに渡すためのカスタマイズを行います。
 */

import { RangeSlider } from "flowbite-react";
import React from "react";

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
    <RangeSlider
      style={{ width: "50vw" }}
      min={0}
      max={4}
      step={1}
      value={value} // ← 親から受け取った value
      onChange={handleChange}
    />
  );
}
