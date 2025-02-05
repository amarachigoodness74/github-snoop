import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  name: string;
  avatar_url: string;
  bio?: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  searchedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  name: { type: String },
  avatar_url: { type: String, required: true },
  bio: { type: String },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  public_repos: { type: Number, required: true },
  html_url: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
