import { GroupMember } from "@/types";

export async function analyzeMBTI(members: GroupMember[]) {
  console.log("members", members);
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ members }),
  });

  if (!response.ok) {
    throw new Error("診断に失敗しました");
  }

  return response.json();
}
