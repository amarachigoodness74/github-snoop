import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    const { user } = req.body;

    // Avoid duplicate users by checking if they already exist
    const existingUser = await usersCollection.findOne({ login: user.login });

    if (!existingUser) {
      await usersCollection.insertOne(user);
    }

    client.close();

    res.status(200).json({ message: "User saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
};

export default handler;
