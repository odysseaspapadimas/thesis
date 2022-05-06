import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    createdAt: String,
    image_url: String,
    plan_to: [
      {
        _id: false,
        id: String,
      },
    ],
    watched: [
      {
        _id: false,
        id: String,
      },
    ],
    favorite: [
      {
        _id: false,
        id: String,
      },
    ],
  },
  { versionKey: false }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
