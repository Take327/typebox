import type { CustomFlowbiteTheme } from "flowbite-react";

/**
 * @file customTheme.ts
 * @description TypeBoxのデザインガイドラインに合わせて
 * Flowbite-Reactのコンポーネントをカスタマイズします
 */
const customTheme: CustomFlowbiteTheme = {
  // --- Spinner ---
  spinner: {
    base: "inline animate-spin text-gray-200",
    color: {
      // 必要であればaccentを追加し、アクセントカラーのスピナーも使えるようにする
      accent: "fill-[#81d8d0]",

      // 以下は利用頻度に応じて残す or 削除
      failure: "fill-red-600",
      gray: "fill-gray-600",
      info: "fill-cyan-600",
      pink: "fill-pink-600",
      purple: "fill-purple-600",
      success: "fill-green-500",
      warning: "fill-yellow-400",
    },
    light: {
      off: {
        base: "text-gray-600",
        color: {
          // accent: "", // 必要なら追加
          gray: "fill-gray-300",
          failure: "",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
      on: {
        base: "",
        color: {
          // accent: "", // 必要なら追加
          failure: "",
          gray: "",
          info: "",
          pink: "",
          purple: "",
          success: "",
          warning: "",
        },
      },
    },
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    },
  },

  // --- TextInput ---
  textInput: {
    base: "flex",
    field: {
      base: "relative w-full",
      input: {
        base: "block w-full overflow-hidden rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
        sizes: {
          sm: "sm:text-xs",
          md: "text-sm",
          lg: "sm:text-base",
        },
        colors: {
          // デフォルトgrayはこのまま残しておいてOK
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-accent focus:ring-accent",
          // 必要に応じてInfo/Warning/SuccessをTypeBoxのカラーパレットに差し替える
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 focus:ring-cyan-500",
          failure: "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 focus:ring-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500",
        },
      },
    },
  },

  // --- Progress ---
  progress: {
    base: "w-full overflow-hidden rounded-full bg-gray-200",
    label: "mb-1 flex justify-between font-medium",
    bar: "space-x-2 rounded-full text-center font-medium leading-none text-white",
    color: {
      accent: "bg-[#81d8d0]",
      // "81d8d0": "bg-[#81d8d0]" // 重複するので削除
    },
    size: {
      sm: "h-1.5",
      md: "h-2.5",
      lg: "h-4",
      xl: "h-6",
    },
  },

  // --- RangeSlider ---
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

  // --- ToggleSwitch ---
  toggleSwitch: {
    root: {
      base: "group flex rounded-lg focus:outline-none",
      active: {
        on: "cursor-pointer",
        off: "cursor-not-allowed opacity-50",
      },
      label: "ms-3 mt-0.5 text-start text-sm font-medium text-gray-900",
    },
    toggle: {
      base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-accent/25",
      checked: {
        on: "after:translate-x-full after:border-white rtl:after:-translate-x-full",
        off: "border-gray-200 bg-gray-200",
        color: {
          // ここを "accent" に変え、青系の命名を削除
          accent: "border-accent bg-accent",
        },
      },
      sizes: {
        sm: "h-5 w-9 min-w-9 after:left-px after:top-px after:h-4 after:w-4 rtl:after:right-px",
        md: "h-6 w-11 min-w-11 after:left-px after:top-px after:h-5 after:w-5 rtl:after:right-px",
        lg: "h-7 w-14 min-w-14 after:left-1 after:top-0.5 after:h-6 after:w-6 rtl:after:right-1",
      },
    },
  },

  // --- Alert ---
  // TypeBox独自のアクセント色を追加する場合はここで定義
  alert: {
    base: "flex flex-col gap-2 p-4 text-sm",
    borderAccent: "border-t-4",
    closeButton: {
      base: "-m-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 focus:ring-2",
      icon: "h-5 w-5",
      // ここも「accent」を追加し、不要な色は削除してシンプルにまとめられます
      color: {
        accent: "bg-[#81d8d0]/20 text-[#81d8d0] hover:bg-[#81d8d0]/30 focus:ring-accent",
        gray: "bg-gray-100 text-gray-500 hover:bg-gray-200 focus:ring-gray-400",
        // 必要な色だけ残す
        success: "bg-green-100 text-green-500 hover:bg-green-200 focus:ring-green-400",
        failure: "bg-red-100 text-red-500 hover:bg-red-200 focus:ring-red-400",
        warning: "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400",
        // ...
      },
    },
    color: {
      // ここも「accent」を追加するなら下記のように設定できます
      accent: "border-[#81d8d0] bg-[#81d8d0]/20 text-[#81d8d0]",
      // 以下は必要に応じて残す
      info: "border-cyan-500 bg-cyan-100 text-cyan-700",
      gray: "border-gray-500 bg-gray-100 text-gray-700",
      failure: "border-red-500 bg-red-100 text-red-700",
      success: "border-green-500 bg-green-100 text-green-700",
      warning: "border-yellow-500 bg-yellow-100 text-yellow-700",
      // ...
    },
    icon: "mr-3 inline h-5 w-5 flex-shrink-0",
    rounded: "rounded-lg",
    wrapper: "flex items-center",
  },
};

export default customTheme;
