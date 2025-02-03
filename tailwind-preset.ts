import type { Config } from "tailwindcss";

/**
 * shadcn/ui 用の Tailwind プリセット
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
};

export default preset;
