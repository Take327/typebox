import Link from "next/link";
import { Group } from "../../types";
import { AiOutlineLogout } from "react-icons/ai";

export default function GroupListItem({ group }: { group: Group }) {
  return (
    <li key={group.id} className="flex items-center justify-between">
      {/* グループ名リンク */}
      <Link href={`/groups/${group.id}`} className="font-medium text-gray-600 hover:text-black">
        {group.name} <span className="text-sm text-gray-400">({group.members}人)</span>
      </Link>
      {/* 退会ボタン */}
      <button className="text-red-500 hover:text-red-700" aria-label={`${group.name}を退会`}>
        <AiOutlineLogout className="h-5 w-5" />
      </button>
    </li>
  );
}
