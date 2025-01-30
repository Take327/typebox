"use client";

import React from "react";
import Construction from "../../components/Construction";

export default function GroupCard(): React.JSX.Element {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">所属グループ</h2>
      <Construction />
    </div>
  );
}
