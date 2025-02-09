import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import authOptions from "./auth/[...nextauth]";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // const page = parseInt(req.query.page as string) || 1;
  // const limit = parseInt(req.query.limit as string) || 10;
  // const search = (req.query.search as string) || "";

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 10 } = req.query; // Get page & limit from query params
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;
    const search = (req.query.search as string) || "";

    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    const users = await usersCollection.findOne(
      { email: session.user.email },
      {
        projection: {
          searchHistory: { $slice: [skip, limitNum] }, // Paginate search history
          _id: 0,
        },
      }
    );

    // Get total search count
    const totalSearches = await usersCollection
      .aggregate([
        { $match: { email: session.user.email } },
        { $project: { total: { $size: "$searchHistory" } } },
      ])
      .toArray();

    const totalUsers = totalSearches.length > 0 ? totalSearches[0].total : 0;

    client.close();

    res.status(200).json({
      users: users?.searchHistory,
      totalUsers,
      hasMore: skip + limitNum < totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export default handler;
