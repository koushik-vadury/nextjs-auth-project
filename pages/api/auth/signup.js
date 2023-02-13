import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const { email, password } = req.body;
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({
      message: "Invalid input - password should also be at least 6 char. long",
    });

    return;
  }
  const client = await connectToDatabase();

  const db = client.db();
  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    client.close();
    return res.status(422).json({ message: "Email already exists!" });
  }
  const hashedPassword = await hashPassword(password);
  await db.collection("users").insertOne({ email, password: hashedPassword });

  res.status(200).json({ message: "User created successfully" });
  client.close();
};

export default handler;
