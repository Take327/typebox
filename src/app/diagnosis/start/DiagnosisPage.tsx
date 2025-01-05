"use client";
// **外部ライブラリのインポート**
import React, { useState } from "react";
import { Card } from "flowbite-react";
import Link from "next/link";

// **コンポーネントのインポート**
import FlowbitRange from "../../components/FlowbitRange";
import FlowbitProgress from "../../components/FlowbitProgress";
import Backdrop from "../../components/Backdrop";

// **コンテキストのインポート**
import { useProcessing } from "../../../context/ProcessingContext";

// **ロジックやデータのインポート**
import { questions } from "./questions";
import { calculateMBTIType } from "./calculateMBTITypeBL";

// **型のインポート**
import { MBTIDiagnosisResult } from "../../../types";

const DiagnosisPage: React.FC = () => {
  // 現在のページ番号を管理
  const [currentPage, setCurrentPage] = useState<number>(1);

  // プログレスバーの進捗率を管理
  const [progress, setProgress] = useState<number>(0);

  // 回答スコアを保存する配列を初期化（各質問はデフォルトで2）
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(2)
  );

  // 処理中の状態を管理（Backdrop表示用）
  const { setProcessing } = useProcessing();

  // 1ページに表示する質問数
  const questionsPerPage = 15;

  // 現在のページに表示する質問を取得
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  /**
   * サーバーからユーザーIDを取得する非同期関数
   *
   * @returns {Promise<number | null>} ユーザーID（取得できない場合はnull）
   */
  const getUserId = async (): Promise<number | null> => {
    try {
      const response = await fetch("/api/auth/check"); // サーバーの認証チェックエンドポイントを呼び出し
      if (!response.ok) {
        throw new Error("ユーザーIDの取得に失敗しました"); // レスポンスがエラーの場合
      }
      const data = await response.json(); // レスポンスデータをJSON形式で取得
      return data.userId; // ユーザーIDを返却
    } catch (error) {
      console.error("ユーザー ID の取得中にエラーが発生しました:", error); // エラー内容をログ出力
      return null;
    }
  };

  /**
   * 診断結果をサーバーに送信する非同期関数
   *
   * @param {MBTIDiagnosisResult} result - 診断結果オブジェクト
   * @returns {Promise<void>}
   */
  const saveDiagnosisResult = async (
    result: MBTIDiagnosisResult
  ): Promise<void> => {
    try {
      const userId = await getUserId(); // ユーザーIDを取得
      if (!userId) {
        throw new Error("ユーザーIDが見つかりません"); // ユーザーIDが取得できない場合のエラー
      }

      const response = await fetch("/api/insertDiagnosisResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, // ユーザーID
          scores: result.ratio, // 診断スコア
        }),
      });

      if (!response.ok) {
        throw new Error("診断結果を保存できませんでした"); // 保存エラー
      }
    } catch (err) {
      console.error("診断結果の保存中にエラーが発生しました:", err); // エラー内容をログ出力
    }
  };

  /**
   * 次のページに進む処理を実行
   *
   * @returns {Promise<void>}
   */
  const handleNextPage = async (): Promise<void> => {
    if (currentPage * questionsPerPage >= questions.length) {
      // 診断が最後のページの場合
      const result = calculateMBTIType(questions, answers); // 診断結果を計算
      setProcessing(true); // 処理中状態を設定（Backdropを表示）
      try {
        await saveDiagnosisResult(result); // 診断結果をサーバーに送信
        console.log("診断結果:", result); // 診断結果をログ出力
      } finally {
        setProcessing(false); // 処理終了（Backdropを非表示）
      }
    } else {
      // 次のページに進む場合
      setProgress(((currentPage * questionsPerPage) / questions.length) * 100); // プログレスバーを更新
      setCurrentPage(currentPage + 1); // 次のページに移動
      window.scrollTo({ top: 0, behavior: "smooth" }); // ページを上部にスクロール
    }
  };

  /**
   * 回答を保存する関数
   *
   * @param {number} index - 回答する質問のインデックス
   * @param {number} score - 回答のスコア
   */
  const handleAnswer = (index: number, score: number): void => {
    const newAnswers = [...answers]; // 現在の回答をコピー
    newAnswers[index] = score; // 指定インデックスの回答を更新
    setAnswers(newAnswers); // 新しい回答を設定
  };

  // 現在のページが最後のページかを判定
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
          const globalIndex = (currentPage - 1) * questionsPerPage + index; // 質問のグローバルインデックスを計算
          return (
            <div
              key={question.id}
              className="flex flex-col items-center py-4 border-b border-gray-300"
            >
              <p className="text-base mb-2 sm:text-lg">{question.text}</p>
              <div className="flex flex-col items-center space-x-4 pb-8">
                <FlowbitRange
                  value={answers[globalIndex]} // 回答スコアを表示
                  onChange={(score: number) => handleAnswer(globalIndex, score)} // スコアを更新
                />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-gray-500">思わない</span>
                  <span className="text-sm text-gray-500">
                    どちらとも思わない
                  </span>
                  <span className="text-sm text-gray-500">思う</span>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div className="flex justify-between items-center mt-4">
        <Link href="/" className="mt-auto">
          <button className="px-4 py-2 bg-gray-700 text-white rounded shadow-md hover:bg-gray-800">
            中断
          </button>
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
