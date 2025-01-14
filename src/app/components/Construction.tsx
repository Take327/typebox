import Image from "next/image";

export default function Construction() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Image
        src="/under_construction.png"
        alt="工事中"
        width={200} // 画像幅
        height={200} // 画像高さ
      />
      <p className="mb-2 text-xl text-gray-400">工事中...</p>
    </div>
  );
}
