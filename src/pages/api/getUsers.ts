import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
import authOptions from "./auth/[...nextauth]";
import { IUserSession } from "@/interfaces/user";

const uri = process.env.MONGODB_URI as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const session: IUserSession | null = await getServerSession(
      req,
      res,
      authOptions
    );
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const client = await MongoClient.connect(uri);
    const db = client.db("github_snoop");
    const usersCollection = db.collection("users");

    const aggregationPipeline = [
      { $match: { email: session.user.email } },
      {
        $project: {
          searchHistory: {
            $cond: {
              if: { $eq: [search, ""] },
              then: "$searchHistory",
              else: {
                $filter: {
                  input: "$searchHistory",
                  as: "history",
                  cond: {
                    $regexMatch: {
                      input: "$$history.login",
                      regex: search,
                      options: "i",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalUsers: { $size: "$searchHistory" },
        },
      },

      {
        $project: {
          searchHistory: { $slice: ["$searchHistory", skip, limitNum] },
          totalUsers: 1,
        },
      },
    ];

    const user = await usersCollection.aggregate(aggregationPipeline).toArray();

    const filteredHistory = user.length > 0 ? user[0].searchHistory : [];
    const totalUsers = user.length > 0 ? user[0].totalUsers : 0;

    client.close();

    res.status(200).json({
      users: filteredHistory,
      totalUsers,
      hasMore: skip + limitNum < totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export default handler;
