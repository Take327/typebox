import { MBTITendency } from "../../types";

export default function MBTITendenciesChart({ tendency }: { tendency: MBTITendency }) {
  console.log(tendency);

  return (
    <div className="mb-3">
      <div className="flex justify-center">
        <p className="mb-1 text-sm font-semibold text-gray-800">{tendency.labelMinus + " ｜ " + tendency.labelPlus}</p>
      </div>
      <div className="relative h-4 w-full rounded-full bg-gray-200">
        <div
          className={`absolute h-4 rounded-full`}
          style={{
            backgroundColor: `${tendency.color}`,
            left: "50%",
            width: `${Math.abs(tendency.value) / 2}%`,
            transform: tendency.value < 0 ? "translateX(-100%)" : "translateX(0)",
          }}
        ></div>
      </div>
      <p className="mt-1 text-center text-xs text-gray-500">
        {`${Math.abs(tendency.value)}%`}
        {tendency.value < 0 ? ` ${tendency.labelMinus}` : ` ${tendency.labelPlus}`}
      </p>
    </div>
  );
}
