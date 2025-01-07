import Image from "next/image";

export default function Construction() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Image
        src="/under_construction.png"
        alt="工事中"
        width={200} // 画像幅
        height={200} // 画像高さ
      />
      <p className="text-xl text-gray-400 mb-2">工事中...</p>
    </div>
  );
}
