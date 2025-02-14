"use client";

import { Card } from "flowbite-react";

export default function InvitePage() {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <Card className="">
        <h1 className="text-xl font-bold">「高橋チーム」 に招待されています</h1>
        <div className="flex justify-around">
          <button className="px-4 py-2 bg-accent text-white">承認</button>
          <button className="px-4 py-2 bg-gray-500 text-white">拒否</button>
        </div>
      </Card>
    </div>
  );
}
