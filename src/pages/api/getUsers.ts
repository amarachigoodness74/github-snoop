import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find().toArray();
    client.close();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export default handler;
