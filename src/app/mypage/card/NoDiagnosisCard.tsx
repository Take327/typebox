"use client";
import React from "react";
import Link from "next/link";

export default function NoDiagnosisCard() {
  return (
    <div className="flex justify-center p-8">
      <div className="w-4/5 min-w-80 p-10 flex flex-col items-center rounded bg-white shadow-md transition-shadow duration-300 hover:shadow-lg sm:max-h-[600px] sm:max-w-[600px]">
        <p className="text-gray-600">ますは診断してみよう！</p>
        <Link href="/diagnosis/start">
          <button className="px-4 py-2 mt-4 text-white rounded bg-81d8d0 hover:bg-81d8d0/90">診断を開始する</button>
        </Link>
      </div>
    </div>
  );
}
