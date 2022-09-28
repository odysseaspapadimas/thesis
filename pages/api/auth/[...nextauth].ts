import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
import { User } from "../../../constants/types";
import bcrypt from "bcrypt";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        //@ts-ignore
        const { email, password } = credentials;

        await dbConnect();
        const user = await UserModel.findOne({ email });
        
        if (user) {
          console.log("return true");
          return signInUser({ password, user });
        } else {
          throw new Error("User with email doesn't exist");
        }
      },
    }),
  ],
  theme: {
    colorScheme: "dark",
  },
});

const signInUser = async ({
  password,
  user,
}: {
  password: string;
  user: User;
}) => {
  if (user.password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect password");
    } else {
      return user as any;
    }
  } else {
    throw new Error("User doesn't exist");
  }
};
