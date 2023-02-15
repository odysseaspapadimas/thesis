import mongoose from "mongoose";

const ListItemSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
  },
  { _id: false }
);

const RatingSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    rating: Number,
    review: String,
  },
  { _id: false }
);

export const UserSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    createdAt: String,
    image_url: String,
    password: String,
    plan_to: [ListItemSchema],
    watched: [ListItemSchema],
    favorites: [ListItemSchema],
    followers: [String],
    following: [String],
    messages: Object,
    activity: Array,
    ratings: [RatingSchema],
  },
  { versionKey: false }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
