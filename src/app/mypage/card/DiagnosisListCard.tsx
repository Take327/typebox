"use client";
import React from "react";
import Card from "../../components/Card";
import { MBTITransitionChart } from "../../components/MBTITransitionChart";
export default function DiagnosisListCard() {
  return (
    <Card title="診断結果遷移">
      <MBTITransitionChart />
    </Card>
  );
}
