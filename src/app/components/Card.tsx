import React from "react";

export default function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card flex aspect-square flex-col items-start rounded bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg sm:max-h-[600px] sm:max-w-[600px]">
      <h2 className="mb-1 text-xl font-bold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
