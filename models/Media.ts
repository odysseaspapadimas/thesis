import mongoose from "mongoose";

const RatingItem = new mongoose.Schema(
  {
    username: String,
    image_url: String,
    rating: Number,
    review: String,
  },
  { _id: false }
);

export const MediaSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    ratings: [RatingItem],
  },
  { versionKey: false }
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
