import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  const client = await MongoClient.connect(process.env.MONGO_DB_URL);

  return client;
};
