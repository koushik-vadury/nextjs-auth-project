import { getSession } from "next-auth/client";
import { checkPassword, hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  const userEmail = session.user.email;
  const oldPass = req.body.oldPassword;
  const newPass = req.body.newPassword;
  console.log(userEmail, oldPass, newPass);

  const client = await connectToDatabase();
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: userEmail });

  console.log(user);
  if (!user) {
    client.close();
    return res.status(401).json({ message: "User not found" });
  }

  const currentPassword = user.password;
  const passwordsAreEqual = await checkPassword(oldPass, currentPassword);
  console.log(passwordsAreEqual);
  if (!passwordsAreEqual) {
    client.close();
    return res.status(403).json({ message: "Invalid password." });
  }

  const hashedPassword = await hashPassword(newPass);
  await client
    .db()
    .collection("users")
    .updateOne({ email: userEmail }, { $set: { password: hashedPassword } });

  client.close();
  res.status(200).json({ message: "Password update successfully!" });
};

export default handler;
