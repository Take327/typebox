import React from "react";

export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-white shadow-md rounded flex flex-col items-start p-4 aspect-square hover:shadow-lg transition-shadow duration-300 sm:max-w-[600px] sm:max-h-[600px]">
      <h2 className="text-xl font-bold mb-1 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
