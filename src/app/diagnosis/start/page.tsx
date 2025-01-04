"use client";
import React, { useState } from "react";
import { Card } from "flowbite-react";
import FlowbitRange from "../../components/FlowbitRange";
import FlowbitProgress from "../../components/FlowbitProgress";
import { questions } from "./questions";

const DiagnosisPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1); // 現在のページ
  const [progress, setProgress] = useState<number>(0);
  const [answers] = useState<number[]>([]); // 回答のスコア保存

  const questionsPerPage = 15; // 1ページに表示する質問数

  // ページごとの質問を取得
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // 次のページへ
  const handleNextPage = () => {
    if (currentPage * questionsPerPage >= questions.length) {
      // 全ページ終了時の処理
      console.log("診断終了", answers);
      // サーバーに送信や結果ページ遷移など
    } else {
      //プログレスバー更新
      setProgress(((currentPage * questionsPerPage) / questions.length) * 100);
      setCurrentPage(currentPage + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth", // スムーズなスクロールアニメーション
      });
    }
  };

  // 中断ボタン処理
  const handleAbort = () => {
    console.log("診断中断", answers);
    // 保存処理やマイページ遷移など
  };

  // // 回答の処理
  // const handleAnswer = (index: number, score: number) => {
  //   const newAnswers = [...answers];
  //   newAnswers[index] = score;
  //   setAnswers(newAnswers);
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MBTI 診断</h1>
      <div className="m-4">
        <FlowbitProgress progress={progress} />
      </div>
      <Card className="mb-6 shadow-lg">
        {currentQuestions.map((question, index) => (
          <div
            key={question.id}
            className="flex flex-col items-center py-4 border-b border-gray-300"
          >
            <p className="text-base mb-2 sm:text-lg">{question.text}</p>
            <div className="flex flex-col items-center space-x-4 pb-8">
              <FlowbitRange key={index} />
              <div
                className="flex justify-between w-full"
                style={{ marginLeft: "0px" }}
              >
                <span className="text-sm text-gray-500">思わない</span>
                <span className="text-sm text-gray-500">
                  どちらとも思わない
                </span>

                <span className="text-sm text-gray-500">思う</span>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleAbort}
          className="px-4 py-2 bg-gray-700 text-white rounded shadow-md hover:bg-gray-800"
        >
          中断
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-a8d8cb text-white rounded hover:bg-a8d8cb/90"
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default DiagnosisPage;
