import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id?: string;
  email?: string;
  password?: string;
  userName?: string;
  refreshToken?: string[];
  profilePicture?: string;
  googleId?: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: function (this: { googleId?: string }) {
      return !this.googleId;
    },
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  profilePicture: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
