"use client";
import React, { useState } from "react";
import { Card } from "flowbite-react";
import FlowbitRange from "../../components/FlowbitRange";
import FlowbitProgress from "../../components/FlowbitProgress";
import { questions } from "./questions";
import { calculateMBTIType } from "./calculateMBTITypeBL";
import Link from "next/link";
import { useProcessing } from "../../../context/ProcessingContext";
import Backdrop from "../../components/Backdrop";

const DiagnosisPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(2));
  const [error, setError] = useState<string | null>(null);
  const { setProcessing } = useProcessing();

  const questionsPerPage = 15;

  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const getUserId = async (): Promise<number | null> => {
    try {
      const response = await fetch("/api/auth/check");
      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }
      const data = await response.json();
      return data.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const saveDiagnosisResult = async (result: any) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch("/api/insertDiagnosisResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          scores: result.ratio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save diagnosis result.");
      }
    } catch (err) {
      console.error("Error saving diagnosis result:", err);
      setError("診断結果の保存に失敗しました。再試行してください。");
    }
  };

  const handleNextPage = async () => {
    if (currentPage * questionsPerPage >= questions.length) {
      const result = calculateMBTIType(questions, answers);
      setProcessing(true);
      try {
        await saveDiagnosisResult(result);
        console.log("診断結果:", result);
      } finally {
        setProcessing(false);
      }
    } else {
      setProgress(((currentPage * questionsPerPage) / questions.length) * 100);
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnswer = (index: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = score;
    setAnswers(newAnswers);
  };

  const isLastPage = currentPage * questionsPerPage >= questions.length;

  return (
    <div className="container mx-auto p-4">
      <Backdrop />
      <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断</h1>
      <div className="m-4">
        <FlowbitProgress progress={progress} />
      </div>
      <Card className="mb-6 shadow-lg">
        {currentQuestions.map((question, index) => {
          const globalIndex = (currentPage - 1) * questionsPerPage + index;
          return (
            <div key={question.id} className="flex flex-col items-center py-4 border-b border-gray-300">
              <p className="text-base mb-2 sm:text-lg">{question.text}</p>
              <div className="flex flex-col items-center space-x-4 pb-8">
                <FlowbitRange
                  value={answers[globalIndex]}
                  onChange={(score: number) => handleAnswer(globalIndex, score)}
                />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-gray-500">思わない</span>
                  <span className="text-sm text-gray-500">どちらとも思わない</span>
                  <span className="text-sm text-gray-500">思う</span>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div className="flex justify-between items-center mt-4">
        <Link href="/" className="mt-auto">
          <button className="px-4 py-2 bg-gray-700 text-white rounded shadow-md hover:bg-gray-800">中断</button>
        </Link>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90"
        >
          {isLastPage ? "結果を確認する" : "次の質問へ"}
        </button>
      </div>
    </div>
  );
};

export default DiagnosisPage;
