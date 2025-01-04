import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromSession } from "../../../../lib/getUserIdFromSession";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserIdFromSession(req, res);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ userId });
}
