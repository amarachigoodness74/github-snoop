import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import authOptions from "./auth/[...nextauth]";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    // Avoid duplicate users by checking if they already exist
    // const existingUser = await usersCollection.findOne({ login: user.login });

    // if (!existingUser) {
    // await usersCollection.insertOne(user);
    await usersCollection.updateOne(
      { email: session.user.email },
      {
        $addToSet: {
          searchHistory: req.body,
        },
      }
    );
    // }

    client.close();

    res.status(200).json({ message: "User saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
};

export default handler;
