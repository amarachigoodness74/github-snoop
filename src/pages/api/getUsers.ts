import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || ""; // Search term

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    const filter = search
      ? { username: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    const users = await usersCollection
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const totalUsers = await usersCollection.countDocuments(filter);

    client.close();

    res.status(200).json({
      users,
      totalUsers,
      hasMore: page * limit < totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export default handler;
