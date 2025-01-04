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

/**
 * FlowbitRangeProps 型。
 * @property {function(score: number): void} [onChange] - スライダーの値が変更されたときに呼び出されるコールバック関数。
 */
type FlowbitRangeProps = {
  onChange?: (score: number) => void;
};

/**
 * FlowbitRange コンポーネント。
 * @param {FlowbitRangeProps} props - コンポーネントのプロパティ。
 * @returns {JSX.Element} カスタマイズされたスライダーコンポーネント。
 */
export default function FlowbitRange({
  onChange,
}: FlowbitRangeProps): React.JSX.Element {
  /**
   * スライダーの値が変更されたときに呼び出されるハンドラ。
   * @param {React.ChangeEvent<HTMLInputElement>} event - スライダーの変更イベント。
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Flowbite theme={{ theme: customTheme }}>
      {/* RangeSlider コンポーネント。ユーザーが値を選択できます。 */}
      <RangeSlider
        style={{
          width: "50vw",
        }}
        min={-2}
        max={2}
        step={1}
        onChange={handleChange}
      />
    </Flowbite>
  );
}
