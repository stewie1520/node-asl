import mongoose, { model, ProjectionFields, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends mongoose.Document, User {}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.plugin(paginate);

export const withoutPassword: ProjectionFields<UserDocument> = {
  password: 0,
};

export const UserModel = model<
  UserDocument,
  mongoose.PaginateModel<UserDocument>
>("User", userSchema);
